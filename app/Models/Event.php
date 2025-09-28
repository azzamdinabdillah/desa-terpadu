<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Event extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'event_name',
        'description',
        'date_start',
        'date_end',
        'location',
        'flyer',
        'status',
        'type',
        'max_participants',
        'created_by',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'date_start' => 'datetime',
            'date_end' => 'datetime',
        ];
    }

    /**
     * Get the user who created this event.
     */
    public function createdBy(): BelongsTo
    {
        return $this->belongsTo(Citizen::class, 'created_by');
    }

    /**
     * Get the user who created this event (alias for createdBy).
     */
    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    /**
     * Get the participants for this event.
     */
    public function participants(): HasMany
    {
        return $this->hasMany(EventParticipant::class);
    }

    /**
     * Get the documentation for this event.
     */
    public function documentations(): HasMany
    {
        return $this->hasMany(EventsDocumentation::class);
    }

    /**
     * Get the documentation for this event (alias for documentations).
     */
    public function documentation(): HasMany
    {
        return $this->hasMany(EventsDocumentation::class);
    }

    /**
     * Check if event is pending.
     */
    public function isPending(): bool
    {
        return $this->status === 'pending';
    }

    /**
     * Check if event is ongoing.
     */
    public function isOngoing(): bool
    {
        return $this->status === 'ongoing';
    }

    /**
     * Check if event is finished.
     */
    public function isFinished(): bool
    {
        return $this->status === 'finished';
    }

    /**
     * Check if event is public.
     */
    public function isPublic(): bool
    {
        return $this->type === 'public';
    }

    /**
     * Check if event is restricted.
     */
    public function isRestricted(): bool
    {
        return $this->type === 'restricted';
    }

    /**
     * Check if event has reached maximum participants.
     */
    public function hasReachedMaxParticipants(): bool
    {
        if (!$this->max_participants) {
            return false;
        }
        
        return $this->participants()->count() >= $this->max_participants;
    }

    /**
     * Get available spots for this event.
     */
    public function getAvailableSpots(): int
    {
        if (!$this->max_participants) {
            return -1; // Unlimited
        }
        
        return max(0, $this->max_participants - $this->participants()->count());
    }

    /**
     * Scope to get only pending events.
     */
    public function scopePending($query)
    {
        return $query->where('status', 'pending');
    }

    /**
     * Scope to get only ongoing events.
     */
    public function scopeOngoing($query)
    {
        return $query->where('status', 'ongoing');
    }

    /**
     * Scope to get only finished events.
     */
    public function scopeFinished($query)
    {
        return $query->where('status', 'finished');
    }

    /**
     * Scope to get only public events.
     */
    public function scopePublic($query)
    {
        return $query->where('type', 'public');
    }

    /**
     * Scope to get only restricted events.
     */
    public function scopeRestricted($query)
    {
        return $query->where('type', 'restricted');
    }
}
