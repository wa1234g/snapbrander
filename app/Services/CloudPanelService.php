<?php

namespace App\Services;

use App\Models\Project;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Str;

class CloudPanelService
{
    protected string $apiUrl;
    protected string $apiKey;

    public function __construct()
    {
        $this->apiUrl = config('services.cloudpanel.url');
        $this->apiKey = config('services.cloudpanel.api_key');
    }

    public function createWordPressSite(Project $project): array
    {
        $subdomain = $project->subdomain;
        $domain = $subdomain . '.fureraa.com';
        
        $siteData = [
            'domain' => $domain,
            'document_root' => "/home/cloudpanel/htdocs/{$domain}",
            'php_version' => '8.1',
            'vhost_template' => 'WordPress',
        ];

        try {
            $response = Http::withHeaders([
                'Authorization' => 'Bearer ' . $this->apiKey,
                'Content-Type' => 'application/json',
            ])->post($this->apiUrl . '/api/v1/sites', $siteData);

            if (!$response->successful()) {
                throw new \Exception('Failed to create site: ' . $response->body());
            }

            $siteId = $response->json()['data']['id'];

            $dbData = $this->createDatabase($siteId, $project);
            $wpData = $this->installWordPress($siteId, $project, $dbData);

            return [
                'site_id' => $siteId,
                'domain' => $domain,
                'admin_url' => "https://{$domain}/wp-admin",
                'username' => $wpData['username'],
                'password' => $wpData['password'],
                'database' => $dbData,
            ];

        } catch (\Exception $e) {
            throw new \Exception('CloudPanel site creation failed: ' . $e->getMessage());
        }
    }

    public function customizeSite(Project $project): void
    {
        try {
            $this->installTheme($project);
            
            if ($project->business_type === 'store') {
                $this->installWooCommerce($project);
            }

            $this->importTemplate($project);
            $this->applyCustomizations($project);

        } catch (\Exception $e) {
            $project->logs()->create([
                'action' => 'customization_failed',
                'description' => 'Site customization failed: ' . $e->getMessage(),
                'level' => 'warning',
            ]);
        }
    }

    protected function createDatabase(string $siteId, Project $project): array
    {
        $dbName = 'wp_' . str_replace('-', '_', $project->subdomain);
        $dbUser = $dbName . '_user';
        $dbPassword = Str::random(16);

        $dbData = [
            'name' => $dbName,
            'user' => $dbUser,
            'password' => $dbPassword,
        ];

        $response = Http::withHeaders([
            'Authorization' => 'Bearer ' . $this->apiKey,
        ])->post($this->apiUrl . "/api/v1/sites/{$siteId}/databases", $dbData);

        if (!$response->successful()) {
            throw new \Exception('Failed to create database: ' . $response->body());
        }

        return $dbData;
    }

    protected function installWordPress(string $siteId, Project $project, array $dbData): array
    {
        $wpUsername = 'admin_' . substr($project->subdomain, 0, 10);
        $wpPassword = Str::random(12);
        $wpEmail = $project->user->email;

        $wpData = [
            'title' => $project->business_name,
            'admin_user' => $wpUsername,
            'admin_password' => $wpPassword,
            'admin_email' => $wpEmail,
            'db_name' => $dbData['name'],
            'db_user' => $dbData['user'],
            'db_password' => $dbData['password'],
            'language' => $project->user->language === 'ar' ? 'ar' : 'en_US',
        ];

        $response = Http::withHeaders([
            'Authorization' => 'Bearer ' . $this->apiKey,
        ])->post($this->apiUrl . "/api/v1/sites/{$siteId}/wordpress", $wpData);

        if (!$response->successful()) {
            throw new \Exception('Failed to install WordPress: ' . $response->body());
        }

        return [
            'username' => $wpUsername,
            'password' => $wpPassword,
            'email' => $wpEmail,
        ];
    }

    protected function installTheme(Project $project): void
    {
        $this->executeWPCLI($project, [
            'theme', 'install', 'hello-elementor', '--activate'
        ]);
    }

    protected function installWooCommerce(Project $project): void
    {
        $this->executeWPCLI($project, [
            'plugin', 'install', 'woocommerce', '--activate'
        ]);
    }

    protected function importTemplate(Project $project): void
    {
        if (!$project->template) {
            return;
        }

        $templatePath = storage_path('app/public/' . $project->template->template_kit_path);
        
        if (file_exists($templatePath)) {
            $this->executeWPCLI($project, [
                'plugin', 'install', 'elementor', '--activate'
            ]);

            $this->executeWPCLI($project, [
                'elementor', 'import', $templatePath
            ]);
        }
    }

    protected function applyCustomizations(Project $project): void
    {
        if ($project->colors) {
            $this->applyColorScheme($project);
        }

        if ($project->logo_path) {
            $this->uploadLogo($project);
        }

        $this->updateSiteContent($project);
    }

    protected function applyColorScheme(Project $project): void
    {
        $colors = $project->colors;
        
        $customCSS = "
        :root {
            --primary-color: {$colors['primary']};
            --secondary-color: {$colors['secondary']};
            --accent-color: {$colors['accent']};
            --background-color: {$colors['background']};
            --text-color: {$colors['text']};
        }
        ";

        $this->executeWPCLI($project, [
            'option', 'update', 'custom_css', $customCSS
        ]);
    }

    protected function uploadLogo(Project $project): void
    {
        $logoPath = storage_path('app/public/' . $project->logo_path);
        
        if (file_exists($logoPath)) {
            $this->executeWPCLI($project, [
                'media', 'import', $logoPath, '--title=' . $project->business_name . ' Logo'
            ]);
        }
    }

    protected function updateSiteContent(Project $project): void
    {
        $this->executeWPCLI($project, [
            'option', 'update', 'blogname', $project->business_name
        ]);

        if ($project->description) {
            $this->executeWPCLI($project, [
                'option', 'update', 'blogdescription', $project->description
            ]);
        }
    }

    protected function executeWPCLI(Project $project, array $command): void
    {
        $domain = $project->subdomain . '.fureraa.com';
        $path = "/home/cloudpanel/htdocs/{$domain}";
        
        $fullCommand = array_merge(['wp', '--path=' . $path], $command);
        $commandString = implode(' ', array_map('escapeshellarg', $fullCommand));

        try {
            $response = Http::withHeaders([
                'Authorization' => 'Bearer ' . $this->apiKey,
            ])->post($this->apiUrl . '/api/v1/execute', [
                'command' => $commandString,
            ]);

            if (!$response->successful()) {
                throw new \Exception('WP-CLI command failed: ' . $response->body());
            }

        } catch (\Exception $e) {
            $project->logs()->create([
                'action' => 'wpcli_command_failed',
                'description' => 'WP-CLI command failed: ' . $commandString,
                'metadata' => ['error' => $e->getMessage()],
                'level' => 'warning',
            ]);
        }
    }
}
