<?php

namespace Database\Seeders;

use App\Models\Setting;
use Illuminate\Database\Seeder;

class SettingsSeeder extends Seeder
{
    public function run(): void
    {
        $settings = [
            [
                'key' => 'app_name',
                'value' => 'SnapBrander',
                'type' => 'string',
                'description' => 'Application name',
                'is_public' => true,
            ],
            [
                'key' => 'default_currency',
                'value' => 'EGP',
                'type' => 'string',
                'description' => 'Default currency',
                'is_public' => true,
            ],
            [
                'key' => 'default_language',
                'value' => 'ar',
                'type' => 'string',
                'description' => 'Default language',
                'is_public' => true,
            ],
            [
                'key' => 'trial_duration_hours',
                'value' => '72',
                'type' => 'integer',
                'description' => 'Trial duration in hours',
                'is_public' => false,
            ],
            [
                'key' => 'supported_languages',
                'value' => json_encode(['ar', 'en']),
                'type' => 'array',
                'description' => 'Supported languages',
                'is_public' => true,
            ],
            [
                'key' => 'supported_currencies',
                'value' => json_encode(['EGP', 'USD', 'EUR']),
                'type' => 'array',
                'description' => 'Supported currencies',
                'is_public' => true,
            ],
            [
                'key' => 'max_projects_per_user',
                'value' => '10',
                'type' => 'integer',
                'description' => 'Maximum projects per user',
                'is_public' => false,
            ],
            [
                'key' => 'ai_enabled',
                'value' => '1',
                'type' => 'boolean',
                'description' => 'Enable AI features',
                'is_public' => true,
            ],
        ];

        foreach ($settings as $setting) {
            Setting::updateOrCreate(
                ['key' => $setting['key']],
                $setting
            );
        }
    }
}
