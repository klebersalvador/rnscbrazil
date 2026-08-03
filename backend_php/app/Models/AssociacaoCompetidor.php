<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class AssociacaoCompetidor extends Model
{
    use HasFactory;

    protected $table = 'associacao_competidor';
    protected $primaryKey = 'id_associacao_competidor';
    
    const CREATED_AT = 'data_criacao';
    const UPDATED_AT = 'data_modificacao';

    protected $fillable = [
        'id_usuario', 'id_evento', 'id_cadastrador', 'id_regra_associacao', 'associacao_competidor_paga', 'data_associacao', 'data_validacao'
    ];
}
