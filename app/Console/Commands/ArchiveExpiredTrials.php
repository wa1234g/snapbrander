<?php

namespace App\Console\Commands;

use App\Models\Project;
use App\Models\Notification;
use App\Jobs\SendTrialExpirationWarning;
use Illuminate\Console\Command;

class ArchiveExpiredTrials extends Command
{
    protected $signature = 'snapbrander:archive-expired-trials';
    protected $description = 'Archive projects with expired trials';

    public function handle(): int
    {
        $this->sendTrialWarnings();
        $this->archiveExpiredTrials();
        return 0;
    }

    protected function sendTrialWarnings()
    {
        $warningTimes = [24, 6, 1];

        foreach ($warningTimes as $hours) {
            $projects = Project::where('status', 'active')
                ->whereNotNull('trial_expires_at')
                ->whereBetween('trial_expires_at', [
                    now()->addHours($hours - 0.5),
                    now()->addHours($hours + 0.5)
                ])
                ->get();

            foreach ($projects as $project) {
                SendTrialExpirationWarning::dispatch($project, $hours);
                $this->info("Scheduled warning for project: {$project->business_name} ({$hours}h remaining)");
            }
        }
    }

    protected function archiveExpiredTrials()
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
    }
}
