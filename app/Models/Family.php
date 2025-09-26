<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Family extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'family_name',
        'kk_number',
    ];

    /**
     * Get all citizens for this family.
     */
    public function citizens(): HasMany
    {
        return $this->hasMany(Citizen::class);
    }

    /**
     * Get the head of household for this family.
     */
    public function headOfHousehold()
    {
        return $this->citizens()->where('status', 'head_of_household')->first();
    }
}
