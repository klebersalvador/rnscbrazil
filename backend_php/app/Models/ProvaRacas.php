<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ProvaRacas extends Model
{
    use HasFactory;

    protected $table = 'prova_racas';
    protected $primaryKey = 'id_prova_racas';
    
    const CREATED_AT = 'data_criacao';
    const UPDATED_AT = 'data_modificacao';

    protected $fillable = [
        'acrescimo_premiacao', 'porcentagem_premiacao', 'correr_separado', 'valor_adicional_inscricao', 'id_prova', 'id_evento', 'id_divisao', 'id_raca', 'nao_pontuar_profissional', 'correr_tempo_base'
    ];
}
