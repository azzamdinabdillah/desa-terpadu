<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ApplicationDocument extends Model
{
    use HasFactory;

    protected $fillable = [
        'master_document_id',
        'nik',
        'status',
        'reason',
        'citizen_note',
        'admin_note',
        'file',
    ];

    protected $casts = [
        'status' => 'string',
    ];

    /**
     * Get the master document that owns the application document.
     */
    public function masterDocument(): BelongsTo
    {
        return $this->belongsTo(MasterDocument::class);
    }

    /**
     * Get the citizen that owns the application document.
     */
    public function citizen(): BelongsTo
    {
        return $this->belongsTo(Citizen::class, 'nik', 'nik');
    }
}
