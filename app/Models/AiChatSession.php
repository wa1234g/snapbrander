<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class AiChatSession extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'project_id',
        'session_id',
        'current_step',
        'messages',
        'context',
        'is_active',
        'last_activity_at',
    ];

    protected $casts = [
        'messages' => 'array',
        'context' => 'array',
        'is_active' => 'boolean',
        'last_activity_at' => 'datetime',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function project(): BelongsTo
    {
        return $this->belongsTo(Project::class);
    }

    public function addMessage(string $role, string $content): void
    {
        $messages = $this->messages ?? [];
        $messages[] = [
            'role' => $role,
            'content' => $content,
            'timestamp' => now()->toISOString(),
        ];

        $this->update([
            'messages' => $messages,
            'last_activity_at' => now(),
        ]);
    }
}
