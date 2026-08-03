<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TipoInscricao extends Model
{
    use HasFactory;

    protected $table = 'tipo_inscricao';
    protected $primaryKey = 'id_tipo_inscricao';
    
    const CREATED_AT = 'data_criacao';
    const UPDATED_AT = 'data_modificacao';

    protected $fillable = [
        'nome'
    ];
}
