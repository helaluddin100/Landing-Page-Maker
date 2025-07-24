<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CustomDomain extends Model
{
    use HasFactory;

    protected $fillable = [
        'domain',
        'landing_page_id',
        'is_active',
        'ssl_status',
        'ssl_verified_at',
        'dns_records',
        'verification_status',
        'verified_at',
        'notes'
    ];

    protected $casts = [
        'is_active' => 'boolean',
        'dns_records' => 'array',
        'ssl_verified_at' => 'datetime',
        'verified_at' => 'datetime',
        'created_at' => 'datetime',
        'updated_at' => 'datetime'
    ];

    /**
     * Get the landing page associated with this domain
     */
    public function landingPage()
    {
        return $this->belongsTo(LandingPage::class);
    }

    /**
     * Scope for active domains
     */
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    /**
     * Scope for verified domains
     */
    public function scopeVerified($query)
    {
        return $query->where('verification_status', 'verified');
    }

    /**
     * Check if domain is fully configured
     */
    public function isFullyConfigured()
    {
        return $this->is_active && 
               $this->verification_status === 'verified' && 
               $this->ssl_status === 'active';
    }

    /**
     * Mark domain as verified
     */
    public function markAsVerified()
    {
        $this->update([
            'verification_status' => 'verified',
            'verified_at' => now()
        ]);
    }

    /**
     * Mark SSL as active
     */
    public function markSslActive()
    {
        $this->update([
            'ssl_status' => 'active',
            'ssl_verified_at' => now()
        ]);
    }
}