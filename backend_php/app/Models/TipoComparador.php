<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TipoComparador extends Model
{
    use HasFactory;

    protected $table = 'tipo_comparador';
    protected $primaryKey = 'id_tipo_comparador';
    
    const CREATED_AT = 'data_criacao';
    const UPDATED_AT = 'data_modificacao';

    protected $fillable = [
        'tipo_comparador'
    ];
}
