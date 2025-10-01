<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Asset extends Model
{
    use HasFactory;

    protected $fillable = [
        'code',
        'asset_name',
        'condition',
        'status',
        'notes',
        'image',
    ];

    protected $casts = [
        'condition' => 'string',
        'status' => 'string',
    ];

    /**
     * Get the asset loans for the asset.
     */
    public function assetLoans(): HasMany
    {
        return $this->hasMany(AssetLoan::class);
    }

    /**
     * Get the current active loan for the asset.
     */
    public function activeLoan()
    {
        return $this->assetLoans()
            ->whereIn('status', ['approved', 'active'])
            ->latest()
            ->first();
    }

    /**
     * Check if the asset is currently on loan.
     */
    public function isOnLoan(): bool
    {
        return $this->status === 'onloan';
    }

    /**
     * Check if the asset is available for loan.
     */
    public function isAvailable(): bool
    {
        return $this->status === 'idle';
    }
}
