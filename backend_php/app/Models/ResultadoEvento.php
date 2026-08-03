<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ResultadoEvento extends Model
{
    use HasFactory;

    protected $table = 'resultado_evento';
    protected $primaryKey = 'id_resultado_evento';
    
    const CREATED_AT = 'data_criacao';
    const UPDATED_AT = 'data_modificacao';

    protected $fillable = [
        'id_evento', 'id_cadastrador', 'id_tipo_arquivo', 'titulo', 'descricao', 'arquivo_exibicao'
    ];
}
