<?php

namespace Database\Seeders;

use App\Models\Permission;
use Illuminate\Database\Seeder;

class PermissionsSeeder extends Seeder
{
    public function run(): void
    {
        $permissions = [
            [
                'name' => 'View Project',
                'slug' => 'project.view',
                'description' => 'Can view project details',
                'category' => 'project',
            ],
            [
                'name' => 'Edit Project',
                'slug' => 'project.edit',
                'description' => 'Can edit project settings and content',
                'category' => 'project',
            ],
            [
                'name' => 'Delete Project',
                'slug' => 'project.delete',
                'description' => 'Can delete the project',
                'category' => 'project',
            ],
            [
                'name' => 'Manage Team',
                'slug' => 'team.manage',
                'description' => 'Can invite and manage team members',
                'category' => 'team',
            ],
            [
                'name' => 'Use AI Features',
                'slug' => 'ai.use',
                'description' => 'Can use AI generation features',
                'category' => 'ai',
            ],
            [
                'name' => 'Upload Media',
                'slug' => 'media.upload',
                'description' => 'Can upload and manage media files',
                'category' => 'media',
            ],
            [
                'name' => 'Install Modules',
                'slug' => 'modules.install',
                'description' => 'Can install and configure modules',
                'category' => 'modules',
            ],
            [
                'name' => 'Access Analytics',
                'slug' => 'analytics.view',
                'description' => 'Can view project analytics',
                'category' => 'analytics',
            ],
        ];

        foreach ($permissions as $permission) {
            Permission::updateOrCreate(
                ['slug' => $permission['slug']],
                $permission
            );
        }
    }
}
