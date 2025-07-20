<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Section extends Model
{
    use HasFactory;

    protected $fillable = [
        'landing_page_id',
        'section_id',
        'type',
        'data',
        'sort_order',
        'is_active'
    ];

    protected $casts = [
        'data' => 'array',
        'is_active' => 'boolean',
        'sort_order' => 'integer',
        'created_at' => 'datetime',
        'updated_at' => 'datetime'
    ];

    /**
     * Get the landing page that owns this section
     */
    public function landingPage()
    {
        return $this->belongsTo(LandingPage::class);
    }

    /**
     * Scope for active sections
     */
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    /**
     * Scope for ordered sections
     */
    public function scopeOrdered($query)
    {
        return $query->orderBy('sort_order', 'asc')->orderBy('created_at', 'asc');
    }

    /**
     * Scope by section type
     */
    public function scopeOfType($query, $type)
    {
        return $query->where('type', $type);
    }

    /**
     * Get sections for a specific landing page
     */
    public function scopeForPage($query, $pageId)
    {
        return $query->where('landing_page_id', $pageId);
    }
}