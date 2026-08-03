<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class EventoRacas extends Model
{
    use HasFactory;

    protected $table = 'evento_racas';
    protected $primaryKey = 'id_evento_raca';
    
    const CREATED_AT = 'data_criacao';
    const UPDATED_AT = 'data_modificacao';

    protected $fillable = [
        'acrescimo_premiacao', 'porcentagem_premiacao', 'correr_separado', 'valor_adicional_inscricao', 'id_evento', 'id_raca', 'nao_pontuar_profissional', 'correr_tempo_base'
    ];
}
