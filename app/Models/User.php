<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'phone',
        'country',
        'language',
        'currency',
        'timezone',
        'role',
        'is_active',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'email_verified_at' => 'datetime',
        'password' => 'hashed',
        'is_active' => 'boolean',
    ];

    public function projects(): HasMany
    {
        return $this->hasMany(Project::class);
    }

    public function drafts(): HasMany
    {
        return $this->hasMany(Draft::class);
    }

    public function aiRequests(): HasMany
    {
        return $this->hasMany(AiRequest::class);
    }

    public function notifications(): HasMany
    {
        return $this->hasMany(Notification::class);
    }

    public function teamMemberships(): HasMany
    {
        return $this->hasMany(TeamMember::class);
    }

    public function aiChatSessions(): HasMany
    {
        return $this->hasMany(AiChatSession::class);
    }

    public function mediaGallery(): HasMany
    {
        return $this->hasMany(MediaGallery::class);
    }

    public function marketplaceItems(): HasMany
    {
        return $this->hasMany(MarketplaceItem::class, 'seller_id');
    }

    public function isAdmin(): bool
    {
        return $this->role === 'admin';
    }
}
