<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Resultado extends Model
{
    use HasFactory;

    protected $table = 'resultado';
    protected $primaryKey = 'id_resultado';
    
    const CREATED_AT = 'data_criacao';
    const UPDATED_AT = 'data_modificacao';

    protected $fillable = [
        'boi_sorteado', 'classificacao', 'corrido', 'quantidade_boi', 'quantidade_boi_total', 'tempo_apurado', 'tempo_apurado_total', 'tempo_real', 'tempo_real_total', 'id_inscricao', 'id_prova'
    ];
}
