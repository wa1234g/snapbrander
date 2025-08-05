<?php

namespace Database\Seeders;

use App\Models\Module;
use Illuminate\Database\Seeder;

class ModulesSeeder extends Seeder
{
    public function run(): void
    {
        $modules = [
            [
                'name' => 'Contact Form',
                'slug' => 'contact-form',
                'description' => 'Add a contact form to your website',
                'icon' => 'mail',
                'category' => 'communication',
                'config_schema' => [
                    'fields' => ['name', 'email', 'message'],
                    'email_recipient' => 'required',
                ],
                'price' => 0,
                'is_free' => true,
                'sort_order' => 1,
            ],
            [
                'name' => 'Live Chat',
                'slug' => 'live-chat',
                'description' => 'Add live chat functionality',
                'icon' => 'message-circle',
                'category' => 'communication',
                'config_schema' => [
                    'chat_provider' => 'required',
                    'widget_position' => 'bottom-right',
                ],
                'price' => 29.99,
                'is_free' => false,
                'sort_order' => 2,
            ],
            [
                'name' => 'Booking System',
                'slug' => 'booking-system',
                'description' => 'Allow customers to book appointments',
                'icon' => 'calendar',
                'category' => 'booking',
                'config_schema' => [
                    'time_slots' => 'required',
                    'booking_duration' => 'required',
                ],
                'price' => 49.99,
                'is_free' => false,
                'sort_order' => 3,
            ],
            [
                'name' => 'Social Media Links',
                'slug' => 'social-media',
                'description' => 'Add social media links and widgets',
                'icon' => 'share-2',
                'category' => 'social',
                'config_schema' => [
                    'platforms' => ['facebook', 'twitter', 'instagram', 'linkedin'],
                    'display_style' => 'icons',
                ],
                'price' => 0,
                'is_free' => true,
                'sort_order' => 4,
            ],
            [
                'name' => 'Analytics',
                'slug' => 'analytics',
                'description' => 'Track website visitors and performance',
                'icon' => 'bar-chart',
                'category' => 'analytics',
                'config_schema' => [
                    'tracking_id' => 'required',
                    'provider' => 'google-analytics',
                ],
                'price' => 19.99,
                'is_free' => false,
                'sort_order' => 5,
            ],
            [
                'name' => 'E-commerce Features',
                'slug' => 'ecommerce',
                'description' => 'Advanced e-commerce functionality',
                'icon' => 'shopping-cart',
                'category' => 'ecommerce',
                'config_schema' => [
                    'payment_methods' => ['stripe', 'paypal'],
                    'shipping_options' => 'required',
                ],
                'price' => 99.99,
                'is_free' => false,
                'sort_order' => 6,
            ],
        ];

        foreach ($modules as $module) {
            Module::updateOrCreate(
                ['slug' => $module['slug']],
                $module
            );
        }
    }
}
