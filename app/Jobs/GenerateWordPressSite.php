<?php

namespace App\Jobs;

use App\Models\Project;
use App\Services\CloudPanelService;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;

class GenerateWordPressSite implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    protected Project $project;

    public function __construct(Project $project)
    {
        $this->project = $project;
    }

    public function handle(CloudPanelService $cloudPanelService): void
    {
        try {
            $this->project->logs()->create([
                'action' => 'site_generation_started',
                'description' => 'Starting WordPress site generation',
                'level' => 'info',
            ]);

            $siteData = $cloudPanelService->createWordPressSite($this->project);

            $this->project->update([
                'status' => 'active',
                'wp_admin_url' => $siteData['admin_url'],
                'wp_username' => $siteData['username'],
                'wp_password' => $siteData['password'],
            ]);

            $cloudPanelService->customizeSite($this->project);

            $this->project->logs()->create([
                'action' => 'site_generation_completed',
                'description' => 'WordPress site generated successfully',
                'metadata' => [
                    'admin_url' => $siteData['admin_url'],
                    'site_url' => "https://{$this->project->subdomain}.fureraa.com",
                ],
                'level' => 'info',
            ]);

            $this->project->user->notifications()->create([
                'title' => 'موقعك جاهز!',
                'message' => "تم إنشاء موقع {$this->project->business_name} بنجاح. يمكنك الآن الوصول إليه وإدارته.",
                'type' => 'success',
                'data' => [
                    'project_id' => $this->project->id,
                    'site_url' => "https://{$this->project->subdomain}.fureraa.com",
                    'admin_url' => $siteData['admin_url'],
                ],
            ]);

        } catch (\Exception $e) {
            $this->project->update(['status' => 'draft']);

            $this->project->logs()->create([
                'action' => 'site_generation_failed',
                'description' => 'WordPress site generation failed',
                'metadata' => ['error' => $e->getMessage()],
                'level' => 'error',
            ]);

            $this->project->user->notifications()->create([
                'title' => 'فشل في إنشاء الموقع',
                'message' => 'حدث خطأ أثناء إنشاء موقعك. يرجى المحاولة مرة أخرى أو التواصل مع الدعم.',
                'type' => 'error',
                'data' => ['project_id' => $this->project->id],
            ]);

            throw $e;
        }
    }
}
