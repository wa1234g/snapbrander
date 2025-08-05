<?php

namespace Database\Seeders;

use App\Models\Plan;
use Illuminate\Database\Seeder;

class PaymentSeeder extends Seeder
{
    public function run(): void
    {
        $plans = [
            [
                'name' => 'الباقة الأساسية',
                'description' => 'مثالية للمشاريع الصغيرة والشخصية',
                'monthly_price' => 99.00,
                'yearly_price' => 990.00,
                'features' => [
                    'موقع واحد',
                    'قوالب محدودة',
                    'دعم أساسي',
                    'مساحة تخزين 5 جيجا',
                ],
                'max_projects' => 1,
                'max_storage_gb' => 5,
                'is_popular' => false,
                'is_active' => true,
                'sort_order' => 1,
            ],
            [
                'name' => 'الباقة المتقدمة',
                'description' => 'الأفضل للشركات الصغيرة والمتوسطة',
                'monthly_price' => 199.00,
                'yearly_price' => 1990.00,
                'features' => [
                    '5 مواقع',
                    'جميع القوالب',
                    'دعم متقدم',
                    'مساحة تخزين 50 جيجا',
                    'تحليلات متقدمة',
                    'نسخ احتياطية يومية',
                ],
                'max_projects' => 5,
                'max_storage_gb' => 50,
                'is_popular' => true,
                'is_active' => true,
                'sort_order' => 2,
            ],
            [
                'name' => 'الباقة الاحترافية',
                'description' => 'للشركات الكبيرة والوكالات',
                'monthly_price' => 399.00,
                'yearly_price' => 3990.00,
                'features' => [
                    'مواقع غير محدودة',
                    'جميع القوالب والميزات',
                    'دعم أولوية 24/7',
                    'مساحة تخزين 200 جيجا',
                    'تحليلات متقدمة',
                    'نسخ احتياطية يومية',
                    'SSL مجاني',
                    'CDN عالمي',
                ],
                'max_projects' => -1,
                'max_storage_gb' => 200,
                'is_popular' => false,
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
