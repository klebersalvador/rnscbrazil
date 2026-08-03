<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Campeonato extends Model
{
    use HasFactory;

    protected $table = 'campeonato';
    protected $primaryKey = 'id_campeonato';
    
    // Configura o Laravel para usar essas colunas para timestamps automáticos
    const CREATED_AT = 'data_criacao';
    const UPDATED_AT = 'data_modificacao';

    protected $fillable = [
        'ativo', 'id_organizador', 'campeonato_finalizado', 
        'data_criacao', 'data_inicial', 'data_final', 'data_modificacao',
        'nome', 'descricao', 'porcentagem_premiacao', 'preco_inscricao',
        'imagem_exibicao', 'maximo_inscricoes', 'id_pontuacao'
    ];

    public function organizador()
    {
        return $this->belongsTo(Usuario::class, 'id_organizador', 'id_usuario');
    }

    public function pontuacao()
    {
        return $this->belongsTo(Pontuacao::class, 'id_pontuacao', 'id_pontuacao');
    }
}
