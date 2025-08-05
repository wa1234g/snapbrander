<?php

namespace App\Jobs;

use App\Models\Project;
use App\Models\User;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Mail;

class SendTrialExpirationWarning implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    protected Project $project;
    protected int $hoursRemaining;

    public function __construct(Project $project, int $hoursRemaining)
    {
        $this->project = $project;
        $this->hoursRemaining = $hoursRemaining;
    }

    public function handle(): void
    {
        $user = $this->project->user;
        
        $subject = $this->hoursRemaining <= 1 
            ? 'تنتهي فترة التجربة خلال ساعة واحدة!' 
            : "تنتهي فترة التجربة خلال {$this->hoursRemaining} ساعة";

        $message = $this->buildEmailMessage();

        try {
            Mail::raw($message, function ($mail) use ($user, $subject) {
                $mail->to($user->email)
                     ->subject($subject);
            });

            $this->project->logs()->create([
                'user_id' => $user->id,
                'action' => 'trial_warning_sent',
                'description' => "Trial expiration warning sent ({$this->hoursRemaining}h remaining)",
                'metadata' => ['hours_remaining' => $this->hoursRemaining],
                'level' => 'info',
            ]);

        } catch (\Exception $e) {
            $this->project->logs()->create([
                'user_id' => $user->id,
                'action' => 'trial_warning_failed',
                'description' => 'Failed to send trial expiration warning: ' . $e->getMessage(),
                'metadata' => ['hours_remaining' => $this->hoursRemaining],
                'level' => 'error',
            ]);
        }
    }

    protected function buildEmailMessage(): string
    {
        $user = $this->project->user;
        $projectName = $this->project->business_name;
        $domain = $this->project->domain;
        
        return "
مرحباً {$user->name}،

نود تذكيرك بأن فترة التجربة المجانية لموقعك '{$projectName}' ستنتهي خلال {$this->hoursRemaining} ساعة.

تفاصيل الموقع:
- اسم المشروع: {$projectName}
- الرابط: https://{$domain}

لضمان استمرارية موقعك، يرجى ترقية باقتك قبل انتهاء فترة التجربة.

يمكنك ترقية باقتك من خلال:
https://snapbrander.com/billing

إذا لم تقم بالترقية، سيتم أرشفة موقعك تلقائياً وحذفه نهائياً بعد 3 أيام.

شكراً لاختيارك SnapBrander!

فريق SnapBrander
        ";
    }
}
