<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class UnidadeFederativa extends Model
{
    use HasFactory;

    protected $table = 'unidade_federativa';
    protected $primaryKey = 'id_unidade_federativa';
    
    const CREATED_AT = 'data_criacao';
    const UPDATED_AT = 'data_modificacao';

    protected $fillable = [
        'abreviacao', 'nome'
    ];
}
