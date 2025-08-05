<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Project extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'name',
        'business_name',
        'business_type',
        'description',
        'domain',
        'subdomain',
        'status',
        'template_id',
        'colors',
        'logo_path',
        'modules',
        'wp_admin_url',
        'wp_username',
        'wp_password',
        'trial_expires_at',
        'archived_at',
    ];

    protected $casts = [
        'colors' => 'array',
        'modules' => 'array',
        'trial_expires_at' => 'datetime',
        'archived_at' => 'datetime',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function template(): BelongsTo
    {
        return $this->belongsTo(Template::class);
    }

    public function logs(): HasMany
    {
        return $this->hasMany(ProjectLog::class);
    }

    public function teamMembers(): HasMany
    {
        return $this->hasMany(TeamMember::class);
    }

    public function addons(): HasMany
    {
        return $this->hasMany(ProjectAddon::class);
    }

    public function aiRequests(): HasMany
    {
        return $this->hasMany(AiRequest::class);
    }

    public function mediaGallery(): HasMany
    {
        return $this->hasMany(MediaGallery::class);
    }

    public function isTrialExpired(): bool
    {
        return $this->trial_expires_at && $this->trial_expires_at->isPast();
    }

    public function generateSubdomain(): string
    {
        $base = strtolower(str_replace(' ', '-', $this->business_name));
        $base = preg_replace('/[^a-z0-9-]/', '', $base);
        $random = substr(md5(uniqid()), 0, 6);
        return $base . '-' . $random;
    }
}
