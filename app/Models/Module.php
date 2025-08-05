<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Module extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'slug',
        'description',
        'icon',
        'category',
        'config_schema',
        'price',
        'is_free',
        'is_active',
        'sort_order',
    ];

    protected $casts = [
        'config_schema' => 'array',
        'price' => 'decimal:2',
        'is_free' => 'boolean',
        'is_active' => 'boolean',
    ];

    public function projectAddons(): HasMany
    {
        return $this->hasMany(ProjectAddon::class);
    }
}
