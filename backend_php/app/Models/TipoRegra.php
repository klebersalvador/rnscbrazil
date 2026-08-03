<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TipoRegra extends Model
{
    use HasFactory;

    protected $table = 'tipo_regra';
    protected $primaryKey = 'id_tipo_regra';
    
    const CREATED_AT = 'data_criacao';
    const UPDATED_AT = 'data_modificacao';

    protected $fillable = [
        'descricao'
    ];
}
