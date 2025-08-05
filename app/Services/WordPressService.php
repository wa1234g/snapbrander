<?php

namespace App\Services;

use App\Models\Project;
use App\Models\Template;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Http;
use Exception;

class WordPressService
{
    protected CloudPanelService $cloudPanelService;
    protected LocalAIService $localAIService;

    public function __construct(
        CloudPanelService $cloudPanelService,
        LocalAIService $localAIService
    ) {
        $this->cloudPanelService = $cloudPanelService;
        $this->localAIService = $localAIService;
    }

    public function createWordPressSite(Project $project): array
    {
        try {
            Log::info("Starting WordPress site creation for project: {$project->id}");

            $subdomain = $this->generateSubdomain($project);
            $project->update(['domain' => $subdomain]);

            $siteData = $this->cloudPanelService->createSite([
                'domain' => $subdomain,
                'type' => 'wordpress',
                'php_version' => '8.2',
            ]);

            $wpCredentials = $this->installWordPress($siteData, $project);

            $this->installRequiredPlugins($siteData, $project);

            if ($project->template) {
                $this->importTemplate($siteData, $project->template, $project);
            }

            $this->customizeWithAI($siteData, $project);

            $this->configureSiteSettings($siteData, $project);

            $project->update([
                'status' => 'active',
                'wp_admin_url' => "https://{$subdomain}/wp-admin",
                'wp_username' => $wpCredentials['username'],
                'wp_password' => $wpCredentials['password'],
                'site_url' => "https://{$subdomain}",
            ]);

            Log::info("WordPress site created successfully for project: {$project->id}");

            return [
                'success' => true,
                'site_url' => "https://{$subdomain}",
                'admin_url' => "https://{$subdomain}/wp-admin",
                'credentials' => $wpCredentials,
            ];

        } catch (Exception $e) {
            Log::error("Failed to create WordPress site for project {$project->id}: " . $e->getMessage());
            
            $project->update(['status' => 'failed']);
            
            throw $e;
        }
    }

    protected function generateSubdomain(Project $project): string
    {
        $baseSlug = str_slug($project->name);
        $randomId = substr(md5($project->id . time()), 0, 6);
        
        return "{$baseSlug}-{$randomId}.fureraa.com";
    }

    protected function installWordPress(array $siteData, Project $project): array
    {
        $credentials = [
            'username' => 'admin_' . substr(md5($project->id), 0, 8),
            'password' => str_random(16),
            'email' => $project->user->email,
        ];

        $this->cloudPanelService->executeCommand($siteData['id'], [
            'wp core install',
            '--url=' . $project->domain,
            '--title="' . $project->name . '"',
            '--admin_user=' . $credentials['username'],
            '--admin_password=' . $credentials['password'],
            '--admin_email=' . $credentials['email'],
            '--locale=ar',
        ]);

        return $credentials;
    }

    protected function installRequiredPlugins(array $siteData, Project $project): void
    {
        $plugins = [
            'elementor',
            'hello-elementor',
        ];

        if ($project->business_type === 'store') {
            $plugins[] = 'woocommerce';
        }

        if ($project->modules) {
            foreach ($project->modules as $module) {
                switch ($module['name']) {
                    case 'contact_form':
                        $plugins[] = 'contact-form-7';
                        break;
                    case 'live_chat':
                        $plugins[] = 'wp-live-chat-support';
                        break;
                    case 'booking_system':
                        $plugins[] = 'booking-calendar';
                        break;
                    case 'analytics':
                        $plugins[] = 'google-analytics-for-wordpress';
                        break;
                }
            }
        }

        foreach ($plugins as $plugin) {
            $this->cloudPanelService->executeCommand($siteData['id'], [
                "wp plugin install {$plugin} --activate",
            ]);
        }
    }

    protected function importTemplate(array $siteData, Template $template, Project $project): void
    {
        $templatePath = storage_path("templates/{$template->template_kit_path}");
        
        if (!file_exists($templatePath)) {
            throw new Exception("Template files not found: {$templatePath}");
        }

        $this->cloudPanelService->executeCommand($siteData['id'], [
            'wp theme activate hello-elementor',
        ]);

        $this->importElementorKit($siteData, $templatePath, $project);
    }

    protected function importElementorKit(array $siteData, string $templatePath, Project $project): void
    {
        $manifestPath = $templatePath . '/manifest.json';
        
        if (!file_exists($manifestPath)) {
            throw new Exception("Template manifest not found");
        }

        $manifest = json_decode(file_get_contents($manifestPath), true);
        
        foreach ($manifest['templates'] as $templateData) {
            $templateFile = $templatePath . '/templates/' . $templateData['file'];
            
            if (file_exists($templateFile)) {
                $this->importSingleTemplate($siteData, $templateFile, $templateData, $project);
            }
        }
    }

    protected function importSingleTemplate(array $siteData, string $templateFile, array $templateData, Project $project): void
    {
        $templateContent = file_get_contents($templateFile);
        $templateJson = json_decode($templateContent, true);

        $customizedContent = $this->customizeTemplateContent($templateJson, $project);

        $this->cloudPanelService->executeCommand($siteData['id'], [
            'wp elementor import-template',
            '--file=' . $templateFile,
            '--type=' . $templateData['type'],
        ]);
    }

    protected function customizeTemplateContent(array $templateJson, Project $project): array
    {
        $replacements = [
            'Company Name' => $project->name,
            'Your Business' => $project->name,
            'Business Description' => $project->description ?? '',
        ];

        $jsonString = json_encode($templateJson);
        
        foreach ($replacements as $search => $replace) {
            $jsonString = str_replace($search, $replace, $jsonString);
        }

        return json_decode($jsonString, true);
    }

    protected function customizeWithAI(array $siteData, Project $project): void
    {
        try {
            $homeContent = $this->localAIService->generateContent([
                'type' => 'homepage',
                'business_name' => $project->name,
                'business_type' => $project->business_type,
                'description' => $project->description,
                'language' => 'ar',
            ]);

            $aboutContent = $this->localAIService->generateContent([
                'type' => 'about_page',
                'business_name' => $project->name,
                'business_type' => $project->business_type,
                'language' => 'ar',
            ]);

            $this->updatePageContent($siteData, 'home', $homeContent);
            $this->updatePageContent($siteData, 'about', $aboutContent);

        } catch (Exception $e) {
            Log::warning("AI content generation failed for project {$project->id}: " . $e->getMessage());
        }
    }

    protected function updatePageContent(array $siteData, string $pageSlug, string $content): void
    {
        $this->cloudPanelService->executeCommand($siteData['id'], [
            "wp post update",
            "--post_name={$pageSlug}",
            "--post_content='{$content}'",
        ]);
    }

    protected function configureSiteSettings(array $siteData, Project $project): void
    {
        $commands = [
            'wp language core install ar',
            'wp site switch-language ar',
            
            'wp rewrite structure "/%postname%/"',
            
            'wp option update timezone_string "Africa/Cairo"',
            
            "wp option update blogname '{$project->name}'",
            "wp option update blogdescription '{$project->description}'",
        ];

        if ($project->color_scheme) {
            $this->applyColorScheme($siteData, $project->color_scheme);
        }

        foreach ($commands as $command) {
            $this->cloudPanelService->executeCommand($siteData['id'], $command);
        }
    }

    protected function applyColorScheme(array $siteData, array $colorScheme): void
    {
        $elementorColors = [
            'primary' => $colorScheme['primary'] ?? '#3B82F6',
            'secondary' => $colorScheme['secondary'] ?? '#64748B',
            'accent' => $colorScheme['accent'] ?? '#F59E0B',
        ];

        foreach ($elementorColors as $name => $color) {
            $this->cloudPanelService->executeCommand($siteData['id'], [
                "wp option update elementor_scheme_color_{$name} '{$color}'",
            ]);
        }
    }
}
