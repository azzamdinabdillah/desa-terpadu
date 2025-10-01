<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class AssetLoan extends Model
{
    use HasFactory;

    protected $fillable = [
        'asset_id',
        'citizen_id',
        'status',
        'reason',
        'note',
        'borrowed_at',
        'expected_return_date',
        'returned_at',
        'image_before_loan',
        'image_after_loan',
    ];

    protected $casts = [
        'borrowed_at' => 'datetime',
        'expected_return_date' => 'datetime',
        'returned_at' => 'datetime',
        'status' => 'string',
    ];

    /**
     * Get the asset that owns the loan.
     */
    public function asset(): BelongsTo
    {
        return $this->belongsTo(Asset::class);
    }

    /**
     * Get the citizen that owns the loan.
     */
    public function citizen(): BelongsTo
    {
        return $this->belongsTo(Citizen::class);
    }

    /**
     * Check if the loan is pending.
     */
    public function isPending(): bool
    {
        return $this->status === 'pending';
    }

    /**
     * Check if the loan is approved.
     */
    public function isApproved(): bool
    {
        return $this->status === 'approved';
    }

    /**
     * Check if the loan is active.
     */
    public function isActive(): bool
    {
        return $this->status === 'active';
    }

    /**
     * Check if the loan is returned.
     */
    public function isReturned(): bool
    {
        return $this->status === 'returned';
    }

    /**
     * Check if the loan is rejected.
     */
    public function isRejected(): bool
    {
        return $this->status === 'rejected';
    }

    /**
     * Check if the loan is overdue.
     */
    public function isOverdue(): bool
    {
        return $this->isActive() && 
               $this->expected_return_date && 
               $this->expected_return_date->isPast();
    }
}
