<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Finance extends Model
{
    use HasFactory;

    /**
     * The table associated with the model.
     */
    protected $table = 'finance';

    /**
     * The attributes that are mass assignable.
     */
    protected $fillable = [
        'date',
        'type',
        'amount',
        'note',
        'user_id',
        'proof_image',
    ];

    /**
     * The attributes that should be cast.
     */
    protected $casts = [
        'date' => 'date',
        'amount' => 'decimal:2',
    ];

    /**
     * Get the user that owns the finance record.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
