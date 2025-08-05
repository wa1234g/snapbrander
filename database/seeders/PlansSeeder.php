<?php

namespace Database\Seeders;

use App\Models\Plan;
use Illuminate\Database\Seeder;

class PlansSeeder extends Seeder
{
    public function run(): void
    {
        $plans = [
            [
                'name' => 'Basic',
                'description' => 'Perfect for small businesses and personal websites',
                'price' => 99.00,
                'currency' => 'EGP',
                'duration_days' => 30,
                'features' => [
                    '1 Website',
                    'Basic Templates',
                    'AI Content Generation',
                    'Basic Support',
                    '1GB Storage',
                ],
                'max_projects' => 1,
                'is_active' => true,
                'sort_order' => 1,
            ],
            [
                'name' => 'Professional',
                'description' => 'Ideal for growing businesses with advanced features',
                'price' => 199.00,
                'currency' => 'EGP',
                'duration_days' => 30,
                'features' => [
                    '5 Websites',
                    'Premium Templates',
                    'AI Content & Logo Generation',
                    'Priority Support',
                    '10GB Storage',
                    'Team Collaboration',
                    'Advanced Modules',
                ],
                'max_projects' => 5,
                'is_active' => true,
                'sort_order' => 2,
            ],
            [
                'name' => 'Enterprise',
                'description' => 'Complete solution for large businesses and agencies',
                'price' => 399.00,
                'currency' => 'EGP',
                'duration_days' => 30,
                'features' => [
                    'Unlimited Websites',
                    'All Templates & Modules',
                    'Full AI Suite',
                    '24/7 Premium Support',
                    '100GB Storage',
                    'Advanced Team Management',
                    'White Label Options',
                    'API Access',
                ],
                'max_projects' => -1,
                'is_active' => true,
                'sort_order' => 3,
            ],
        ];

        foreach ($plans as $plan) {
            Plan::updateOrCreate(
                ['name' => $plan['name']],
                $plan
            );
        }
    }
}
