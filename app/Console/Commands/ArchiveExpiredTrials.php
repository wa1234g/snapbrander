<?php

namespace App\Console\Commands;

use App\Models\Project;
use App\Models\Notification;
use Illuminate\Console\Command;

class ArchiveExpiredTrials extends Command
{
    protected $signature = 'snapbrander:archive-expired-trials';
    protected $description = 'Archive projects with expired trials';

    public function handle(): int
    {
        $expiredProjects = Project::where('status', 'active')
            ->whereNotNull('trial_expires_at')
            ->where('trial_expires_at', '<=', now())
            ->get();

        $archivedCount = 0;

        foreach ($expiredProjects as $project) {
            $project->update([
                'status' => 'archived',
                'archived_at' => now(),
            ]);

            $project->logs()->create([
                'action' => 'trial_expired',
                'description' => 'Project archived due to expired trial',
                'level' => 'info',
            ]);

            $project->user->notifications()->create([
                'title' => 'انتهت فترة التجربة المجانية',
                'message' => "انتهت فترة التجربة المجانية لموقع {$project->business_name}. يمكنك الاشتراك لاستعادة الموقع.",
                'type' => 'warning',
                'data' => ['project_id' => $project->id],
            ]);

            $archivedCount++;
        }

        $this->info("Archived {$archivedCount} expired trial projects.");

        return 0;
    }
}
