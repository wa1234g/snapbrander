<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class MarketplaceItem extends Model
{
    use HasFactory;

    protected $fillable = [
        'seller_id',
        'name',
        'description',
        'type',
        'preview_image',
        'gallery_images',
        'file_path',
        'price',
        'currency',
        'tags',
        'status',
        'downloads',
        'rating',
        'reviews_count',
    ];

    protected $casts = [
        'gallery_images' => 'array',
        'tags' => 'array',
        'price' => 'decimal:2',
        'rating' => 'decimal:2',
    ];

    public function seller(): BelongsTo
    {
        return $this->belongsTo(User::class, 'seller_id');
    }
}
