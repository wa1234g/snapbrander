<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Template extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'description',
        'category',
        'preview_image',
        'template_kit_path',
        'demo_data',
        'requires_woocommerce',
        'color_schemes',
        'is_active',
        'sort_order',
    ];

    protected $casts = [
        'demo_data' => 'array',
        'color_schemes' => 'array',
        'requires_woocommerce' => 'boolean',
        'is_active' => 'boolean',
    ];

    public function projects(): HasMany
    {
        return $this->hasMany(Project::class);
    }
}
