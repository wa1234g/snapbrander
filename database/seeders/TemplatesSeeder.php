<?php

namespace Database\Seeders;

use App\Models\Template;
use Illuminate\Database\Seeder;

class TemplatesSeeder extends Seeder
{
    public function run(): void
    {
        $templates = [
            [
                'name' => 'Famosa Digital Marketing Agency',
                'description' => 'Professional digital marketing agency template with modern design and comprehensive pages',
                'category' => 'business',
                'preview_image' => 'templates/famosa-digital-marketing-agency/screenshots/home.png',
                'template_kit_path' => 'templates/famosa-digital-marketing-agency',
                'requires_woocommerce' => false,
                'color_schemes' => [
                    'default' => ['#3B82F6', '#64748B', '#F59E0B', '#FFFFFF', '#1F2937'],
                    'dark' => ['#1F2937', '#374151', '#F59E0B', '#111827', '#F9FAFB'],
                    'agency' => ['#6366F1', '#8B5CF6', '#F59E0B', '#FFFFFF', '#1F2937'],
                ],
                'demo_data' => [
                    'pages' => ['home', 'about-us', 'our-service', 'portofolio', 'testimonials', 'pricing', 'faq', 'contact-us', 'blog'],
                    'features' => ['responsive', 'seo-optimized', 'elementor-pro', 'contact-forms'],
                ],
                'sort_order' => 1,
            ],
            [
                'name' => 'Modern Business',
                'description' => 'A clean and modern template for business websites',
                'category' => 'business',
                'preview_image' => 'templates/previews/modern-business.jpg',
                'template_kit_path' => 'templates/kits/modern-business.zip',
                'requires_woocommerce' => false,
                'color_schemes' => [
                    'default' => ['#3B82F6', '#64748B', '#F59E0B', '#FFFFFF', '#1F2937'],
                    'dark' => ['#1F2937', '#374151', '#F59E0B', '#111827', '#F9FAFB'],
                ],
                'demo_data' => [
                    'pages' => ['home', 'about', 'services', 'contact'],
                    'features' => ['responsive', 'seo-optimized'],
                ],
                'sort_order' => 2,
            ],
            [
                'name' => 'E-commerce Store',
                'description' => 'Perfect template for online stores and e-commerce',
                'category' => 'ecommerce',
                'preview_image' => 'templates/previews/ecommerce-store.jpg',
                'template_kit_path' => 'templates/kits/ecommerce-store.zip',
                'requires_woocommerce' => true,
                'color_schemes' => [
                    'default' => ['#EF4444', '#64748B', '#F59E0B', '#FFFFFF', '#1F2937'],
                    'green' => ['#10B981', '#6B7280', '#F59E0B', '#FFFFFF', '#1F2937'],
                ],
                'demo_data' => [
                    'pages' => ['home', 'shop', 'product', 'cart', 'checkout'],
                    'features' => ['woocommerce', 'payment-gateway', 'inventory'],
                ],
                'sort_order' => 3,
            ],
            [
                'name' => 'Landing Page Pro',
                'description' => 'High-converting landing page template',
                'category' => 'landing',
                'preview_image' => 'templates/previews/landing-pro.jpg',
                'template_kit_path' => 'templates/kits/landing-pro.zip',
                'requires_woocommerce' => false,
                'color_schemes' => [
                    'default' => ['#8B5CF6', '#64748B', '#F59E0B', '#FFFFFF', '#1F2937'],
                    'orange' => ['#F97316', '#6B7280', '#EF4444', '#FFFFFF', '#1F2937'],
                ],
                'demo_data' => [
                    'pages' => ['landing'],
                    'features' => ['conversion-optimized', 'lead-capture'],
                ],
                'sort_order' => 4,
            ],
            [
                'name' => 'Creative Portfolio',
                'description' => 'Showcase your work with this creative portfolio',
                'category' => 'portfolio',
                'preview_image' => 'templates/previews/creative-portfolio.jpg',
                'template_kit_path' => 'templates/kits/creative-portfolio.zip',
                'requires_woocommerce' => false,
                'color_schemes' => [
                    'default' => ['#6366F1', '#64748B', '#F59E0B', '#FFFFFF', '#1F2937'],
                    'pink' => ['#EC4899', '#6B7280', '#F59E0B', '#FFFFFF', '#1F2937'],
                ],
                'demo_data' => [
                    'pages' => ['home', 'portfolio', 'about', 'contact'],
                    'features' => ['gallery', 'lightbox', 'animations'],
                ],
                'sort_order' => 5,
            ],
        ];

        foreach ($templates as $template) {
            Template::updateOrCreate(
                ['name' => $template['name']],
                $template
            );
        }
    }
}
