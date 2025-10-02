<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class SocialAidRecipient extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'family_id',
        'citizen_id',
        'program_id',
        'status',
        'note',
        'performed_by',
        'collected_at',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'collected_at' => 'datetime',
        ];
    }

    /**
     * Get the family that this recipient belongs to.
     */
    public function family(): BelongsTo
    {
        return $this->belongsTo(Family::class);
    }

    /**
     * Get the citizen for this recipient.
     */
    public function citizen(): BelongsTo
    {
        return $this->belongsTo(Citizen::class);
    }

    /**
     * Get the program for this recipient.
     */
    public function program(): BelongsTo
    {
        return $this->belongsTo(SocialAidProgram::class, 'program_id');
    }

    /**
     * Get the user who performed the action.
     */
    public function performedBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'performed_by');
    }

    /**
     * Check if recipient has collected.
     */
    public function isCollected(): bool
    {
        return $this->status === 'collected';
    }

    /**
     * Check if recipient has not collected.
     */
    public function isNotCollected(): bool
    {
        return $this->status === 'not_collected';
    }

    /**
     * Mark as collected.
     */
    public function markAsCollected(int $performedBy, ?string $note = null): void
    {
        $this->update([
            'status' => 'collected',
            'performed_by' => $performedBy,
            'collected_at' => now(),
            'note' => $note,
        ]);
    }

    /**
     * Mark as not collected.
     */
    public function markAsNotCollected(int $performedBy, ?string $note = null): void
    {
        $this->update([
            'status' => 'not_collected',
            'performed_by' => $performedBy,
            'collected_at' => null,
            'note' => $note,
        ]);
    }

    /**
     * Scope for collected recipients.
     */
    public function scopeCollected($query)
    {
        return $query->where('status', 'collected');
    }

    /**
     * Scope for not collected recipients.
     */
    public function scopeNotCollected($query)
    {
        return $query->where('status', 'not_collected');
    }

    /**
     * Scope for individual recipients.
     */
    public function scopeIndividual($query)
    {
        return $query->whereNotNull('citizen_id')->whereNull('family_id');
    }

    /**
     * Scope for household recipients.
     */
    public function scopeHousehold($query)
    {
        return $query->whereNotNull('family_id')->whereNull('citizen_id');
    }

    /**
     * Scope for public recipients.
     */
    public function scopePublic($query)
    {
        return $query->whereNull('family_id')->whereNull('citizen_id');
    }
}
