<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class MasterDocument extends Model
{
    use HasFactory;

    protected $fillable = [
        'document_name',
        'description',
    ];

    /**
     * Get the application documents for the master document.
     */
    public function applicationDocuments(): HasMany
    {
        return $this->hasMany(ApplicationDocument::class);
    }
}
