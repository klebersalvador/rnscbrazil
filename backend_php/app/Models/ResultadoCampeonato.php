<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ResultadoCampeonato extends Model
{
    use HasFactory;

    protected $table = 'resultado_campeonato';
    protected $primaryKey = 'id_resultado_campeonato';
    
    const CREATED_AT = 'data_criacao';
    const UPDATED_AT = 'data_modificacao';

    protected $fillable = [
        'id_campeonato', 'id_cadastrador', 'id_tipo_arquivo', 'titulo', 'descricao', 'arquivo_exibicao'
    ];
}
