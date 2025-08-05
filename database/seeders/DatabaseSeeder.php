<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        $this->call([
            SettingsSeeder::class,
            PlansSeeder::class,
            PaymentSeeder::class,
            TemplatesSeeder::class,
            ModulesSeeder::class,
            PermissionsSeeder::class,
        ]);
    }
}
