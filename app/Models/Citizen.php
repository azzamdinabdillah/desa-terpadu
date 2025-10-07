<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasOne;

class Citizen extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'full_name',
        'nik',
        'email',
        'phone_number',
        'profile_picture',
        'address',
        'date_of_birth',
        'occupation',
        'position',
        'religion',
        'marital_status',
        'gender',
        'status',
        'family_id',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'date_of_birth' => 'date',
        ];
    }

    /**
     * Get the family that this citizen belongs to.
     */
    public function family(): BelongsTo
    {
        return $this->belongsTo(Family::class);
    }

    /**
     * Get the user account for this citizen.
     */
    public function user(): HasOne
    {
        return $this->hasOne(User::class);
    }

    /**
     * Check if this citizen is the head of household.
     */
    public function isHeadOfHousehold(): bool
    {
        return $this->status === 'head_of_household';
    }

    /**
     * Scope to get only head of households.
     */
    public function scopeHeadOfHousehold($query)
    {
        return $query->where('status', 'head_of_household');
    }
}
