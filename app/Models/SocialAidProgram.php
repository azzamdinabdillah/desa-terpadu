<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class SocialAidProgram extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'program_name',
        'period',
        'image',
        'type',
        'status',
        'date_start',
        'date_end',
        'quota',
        'description',
        'location',
        'created_by',
    ];

    /**
     * Get all recipients for this program.
     */
    public function recipients(): HasMany
    {
        return $this->hasMany(SocialAidRecipient::class, 'program_id');
    }

    /**
     * Get the user who created this program.
     */
    public function createdBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    /**
     * Get collected recipients count.
     */
    public function getCollectedCountAttribute(): int
    {
        return $this->recipients()->where('status', 'collected')->count();
    }

    /**
     * Get not collected recipients count.
     */
    public function getNotCollectedCountAttribute(): int
    {
        return $this->recipients()->where('status', 'not_collected')->count();
    }

    /**
     * Get collection rate percentage.
     */
    public function getCollectionRateAttribute(): float
    {
        $total = $this->recipients()->count();
        if ($total === 0) {
            return 0;
        }
        
        return round(($this->collected_count / $total) * 100, 2);
    }

    /**
     * Check if program is for individuals.
     */
    public function isIndividual(): bool
    {
        return $this->type === 'individual';
    }

    /**
     * Check if program is for households.
     */
    public function isHousehold(): bool
    {
        return $this->type === 'household';
    }

    /**
     * Check if program is public.
     */
    public function isPublic(): bool
    {
        return $this->type === 'public';
    }

    /**
     * Scope for individual programs.
     */
    public function scopeIndividual($query)
    {
        return $query->where('type', 'individual');
    }

    /**
     * Scope for household programs.
     */
    public function scopeHousehold($query)
    {
        return $query->where('type', 'household');
    }

    /**
     * Scope for public programs.
     */
    public function scopePublic($query)
    {
        return $query->where('type', 'public');
    }
}
