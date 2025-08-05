<?php

namespace App\Console\Commands;

use App\Models\Project;
use Illuminate\Console\Command;

class DeleteArchivedProjects extends Command
{
    protected $signature = 'snapbrander:delete-archived-projects';
    protected $description = 'Delete projects that have been archived for more than 3 days';

    public function handle(): int
    {
        $projectsToDelete = Project::where('status', 'archived')
            ->whereNotNull('archived_at')
            ->where('archived_at', '<=', now()->subDays(3))
            ->get();

        $deletedCount = 0;

        foreach ($projectsToDelete as $project) {
            $project->logs()->create([
                'action' => 'project_deleted',
                'description' => 'Project permanently deleted after 3 days in archive',
                'level' => 'info',
            ]);

            $project->user->notifications()->create([
                'title' => 'تم حذف الموقع نهائياً',
                'message' => "تم حذف موقع {$project->business_name} نهائياً بعد انتهاء فترة الأرشيف.",
                'type' => 'error',
                'data' => ['project_name' => $project->business_name],
            ]);

            $project->update(['status' => 'deleted']);
            $deletedCount++;
        }

        $this->info("Deleted {$deletedCount} archived projects.");

        return 0;
    }
}
