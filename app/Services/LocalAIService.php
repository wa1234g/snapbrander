<?php

namespace App\Services;

use App\Models\Project;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class LocalAIService
{
    protected string $baseUrl;
    protected array $config;

    public function __construct()
    {
        $this->baseUrl = config('services.localai.url', 'http://localhost:8080');
        $this->config = config('services.localai', []);
    }

    public function generateDescription(string $businessName, string $businessType, ?string $industry, string $language = 'ar'): string
    {
        $prompt = $this->buildDescriptionPrompt($businessName, $businessType, $industry, $language);
        
        return $this->generateText($prompt, [
            'model' => 'mistral-7b-instruct',
            'max_tokens' => 200,
            'temperature' => 0.7,
        ]);
    }

    public function generateContent(Project $project, string $contentType, string $language = 'ar'): string
    {
        $prompt = $this->buildContentPrompt($project, $contentType, $language);
        
        return $this->generateText($prompt, [
            'model' => 'mistral-7b-instruct',
            'max_tokens' => 500,
            'temperature' => 0.8,
        ]);
    }

    public function generateColors(string $businessType, ?string $industry, string $mood = 'professional'): array
    {
        $prompt = $this->buildColorsPrompt($businessType, $industry, $mood);
        
        $response = $this->generateText($prompt, [
            'model' => 'TinyLlama',
            'max_tokens' => 150,
            'temperature' => 0.6,
        ]);

        return $this->parseColorsResponse($response);
    }

    public function generateLogo(string $businessName, string $businessType, string $style = 'modern', ?array $colors = null): string
    {
        $prompt = $this->buildLogoPrompt($businessName, $businessType, $style, $colors);
        
        try {
            $response = Http::timeout(60)->post($this->baseUrl . '/v1/images/generations', [
                'model' => 'stable-diffusion',
                'prompt' => $prompt,
                'size' => '512x512',
                'n' => 1,
                'response_format' => 'b64_json',
            ]);

            if ($response->successful()) {
                $data = $response->json();
                $imageData = base64_decode($data['data'][0]['b64_json']);
                
                $filename = 'logos/' . Str::uuid() . '.png';
                Storage::disk('public')->put($filename, $imageData);
                
                return $filename;
            }

            throw new \Exception('Failed to generate logo: ' . $response->body());

        } catch (\Exception $e) {
            $fallbackPath = $this->createFallbackLogo($businessName);
            return $fallbackPath;
        }
    }

    public function translate(string $text, string $fromLanguage, string $toLanguage): string
    {
        $prompt = $this->buildTranslationPrompt($text, $fromLanguage, $toLanguage);
        
        return $this->generateText($prompt, [
            'model' => 'mistral-7b-instruct',
            'max_tokens' => 300,
            'temperature' => 0.3,
        ]);
    }

    public function chat(string $message, array $history, array $context, ?int $currentStep = null): string
    {
        $prompt = $this->buildChatPrompt($message, $history, $context, $currentStep);
        
        return $this->generateText($prompt, [
            'model' => 'mistral-7b-instruct',
            'max_tokens' => 250,
            'temperature' => 0.7,
        ]);
    }

    public function editImage(string $imagePath, string $operation, array $parameters = []): string
    {
        switch ($operation) {
            case 'remove_background':
                return $this->removeBackground($imagePath);
            case 'enhance':
                return $this->enhanceImage($imagePath, $parameters);
            case 'resize':
                return $this->resizeImage($imagePath, $parameters);
            case 'recolor':
                return $this->recolorImage($imagePath, $parameters);
            default:
                throw new \Exception('Unsupported image operation: ' . $operation);
        }
    }

    protected function generateText(string $prompt, array $options = []): string
    {
        try {
            $response = Http::timeout(30)->post($this->baseUrl . '/v1/chat/completions', [
                'model' => $options['model'] ?? 'mistral-7b-instruct',
                'messages' => [
                    ['role' => 'user', 'content' => $prompt]
                ],
                'max_tokens' => $options['max_tokens'] ?? 200,
                'temperature' => $options['temperature'] ?? 0.7,
                'stream' => false,
            ]);

            if ($response->successful()) {
                $data = $response->json();
                return trim($data['choices'][0]['message']['content'] ?? '');
            }

            throw new \Exception('LocalAI request failed: ' . $response->body());

        } catch (\Exception $e) {
            return $this->getFallbackResponse($prompt, $options);
        }
    }

    protected function removeBackground(string $imagePath): string
    {
        try {
            $imageData = Storage::disk('public')->get($imagePath);
            
            $response = Http::timeout(60)
                ->attach('image', $imageData, 'image.png')
                ->post($this->baseUrl . '/v1/images/remove-background');

            if ($response->successful()) {
                $processedData = $response->body();
                $filename = 'processed/' . Str::uuid() . '.png';
                Storage::disk('public')->put($filename, $processedData);
                return $filename;
            }

            throw new \Exception('Background removal failed');

        } catch (\Exception $e) {
            return $imagePath;
        }
    }

    protected function enhanceImage(string $imagePath, array $parameters): string
    {
        return $imagePath;
    }

    protected function resizeImage(string $imagePath, array $parameters): string
    {
        $width = $parameters['width'] ?? 512;
        $height = $parameters['height'] ?? 512;
        
        return $imagePath;
    }

    protected function recolorImage(string $imagePath, array $parameters): string
    {
        return $imagePath;
    }

    protected function createFallbackLogo(string $businessName): string
    {
        $initials = strtoupper(substr($businessName, 0, 2));
        $colors = ['#3B82F6', '#EF4444', '#10B981', '#F59E0B', '#8B5CF6'];
        $bgColor = $colors[array_rand($colors)];
        
        $svg = '<?xml version="1.0" encoding="UTF-8"?>
        <svg width="200" height="200" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
            <rect width="200" height="200" fill="' . $bgColor . '" rx="20"/>
            <text x="100" y="120" font-family="Arial, sans-serif" font-size="60" font-weight="bold" 
                  text-anchor="middle" fill="white">' . $initials . '</text>
        </svg>';
        
        $filename = 'logos/fallback-' . Str::uuid() . '.svg';
        Storage::disk('public')->put($filename, $svg);
        
        return $filename;
    }

    protected function getFallbackResponse(string $prompt, array $options): string
    {
        if (str_contains($prompt, 'description') || str_contains($prompt, 'وصف')) {
            return 'شركة متخصصة في تقديم خدمات عالية الجودة لعملائها مع التركيز على الابتكار والتميز في الأداء.';
        }

        if (str_contains($prompt, 'translate')) {
            return 'Translation service temporarily unavailable.';
        }

        if (str_contains($prompt, 'chat') || str_contains($prompt, 'help')) {
            return 'مرحباً! كيف يمكنني مساعدتك في إنشاء موقعك الإلكتروني؟';
        }

        return 'AI service temporarily unavailable. Please try again later.';
    }

    protected function parseColorsResponse(string $response): array
    {
        $defaultColors = [
            'primary' => '#3B82F6',
            'secondary' => '#64748B',
            'accent' => '#F59E0B',
            'background' => '#FFFFFF',
            'text' => '#1F2937',
        ];

        preg_match_all('/#[0-9A-Fa-f]{6}/', $response, $matches);
        
        if (count($matches[0]) >= 5) {
            return [
                'primary' => $matches[0][0],
                'secondary' => $matches[0][1],
                'accent' => $matches[0][2],
                'background' => $matches[0][3],
                'text' => $matches[0][4],
            ];
        }

        return $defaultColors;
    }

    protected function buildDescriptionPrompt(string $businessName, string $businessType, ?string $industry, string $language): string
    {
        if ($language === 'ar') {
            return "اكتب وصفاً احترافياً ومقنعاً لشركة '{$businessName}' من نوع '{$businessType}'" . 
                   ($industry ? " في مجال '{$industry}'" : '') . 
                   ". الوصف يجب أن يكون مناسباً للموقع الإلكتروني ولا يزيد عن 150 كلمة.";
        }

        return "Write a professional and compelling description for '{$businessName}', a {$businessType} business" .
               ($industry ? " in the {$industry} industry" : '') .
               ". The description should be suitable for a website and no more than 150 words.";
    }

    protected function buildContentPrompt(Project $project, string $contentType, string $language): string
    {
        $businessName = $project->business_name;
        $businessType = $project->business_type;
        $description = $project->description;

        if ($language === 'ar') {
            return "اكتب محتوى صفحة '{$contentType}' لشركة '{$businessName}' من نوع '{$businessType}'. " .
                   "وصف الشركة: {$description}. " .
                   "المحتوى يجب أن يكون احترافياً ومناسباً للموقع الإلكتروني.";
        }

        return "Write {$contentType} page content for '{$businessName}', a {$businessType} business. " .
               "Company description: {$description}. " .
               "The content should be professional and suitable for a website.";
    }

    protected function buildColorsPrompt(string $businessType, ?string $industry, string $mood): string
    {
        return "Generate a professional color palette for a {$businessType} business" .
               ($industry ? " in the {$industry} industry" : '') .
               " with a {$mood} mood. " .
               "Provide exactly 5 hex colors: primary, secondary, accent, background, and text colors. " .
               "Format: #RRGGBB for each color.";
    }

    protected function buildLogoPrompt(string $businessName, string $businessType, string $style, ?array $colors): string
    {
        $colorText = $colors ? ' using colors ' . implode(', ', $colors) : '';
        
        return "Create a {$style} logo for '{$businessName}', a {$businessType} business{$colorText}. " .
               "The logo should be simple, professional, and memorable. " .
               "Style: minimalist, clean design, suitable for digital use.";
    }

    protected function buildTranslationPrompt(string $text, string $fromLanguage, string $toLanguage): string
    {
        $langMap = ['ar' => 'Arabic', 'en' => 'English'];
        $from = $langMap[$fromLanguage] ?? $fromLanguage;
        $to = $langMap[$toLanguage] ?? $toLanguage;

        return "Translate the following text from {$from} to {$to}. " .
               "Provide only the translation without any additional text:\n\n{$text}";
    }

    protected function buildChatPrompt(string $message, array $history, array $context, ?int $currentStep): string
    {
        $stepContext = '';
        if ($currentStep) {
            $steps = [
                1 => 'business information',
                2 => 'project description',
                3 => 'template selection',
                4 => 'color selection',
                5 => 'logo creation',
                6 => 'modules selection',
                7 => 'final review'
            ];
            $stepContext = "Current step: {$steps[$currentStep]} ({$currentStep}/7). ";
        }

        return "You are a helpful AI assistant for SnapBrander, a website creation platform. " .
               $stepContext .
               "Help the user with their website creation process. " .
               "Be concise, helpful, and supportive. Respond in the same language as the user's message.\n\n" .
               "User message: {$message}";
    }
}
