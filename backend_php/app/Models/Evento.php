<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Evento extends Model
{
    use HasFactory;

    protected $table = 'evento';
    protected $primaryKey = 'id_evento';
    public $timestamps = false; // Evento apparently doesn't have created_at updated_at in the DB schema provided

    protected $fillable = [
        'titulo', 'descricao', 'id_organizador', 'website', 'localizacao',
        'imagem_exibicao', 'data_inicial', 'data_final', 'data_inicio_inscricoes',
        'data_fim_inscricoes', 'id_campeonato', 'telefone', 'maximo_inscricoes_competidor',
        'maximo_inscricoes_duplas', 'porcentagem_premiacao', 'preco_inscricao',
        'porcentagem_premiacao_todos_contra_todos', 'incremento_premiacao_todos_contra_todos',
        'maximo_inscricoes_todos_contra_todos', 'preco_inscricao_todos_contra_todos',
        'quantidade_premiados_todos_contra_todos', 'tempo_passada_todos_contra_todos',
        'maximo_inscricoes', 'localizacao_maps', 'taxa_administrativa', 'maximo_competidores',
        'maximo_inscricoes_trio', 'maximo_inscricoes_cavalo', 'finalizado', 'data_finalizacao',
        'incremento_preco', 'data_inicial_tz'
    ];

    public function campeonato()
    {
        return $this->belongsTo(Campeonato::class, 'id_campeonato', 'id_campeonato');
    }

    public function organizador()
    {
        return $this->belongsTo(Usuario::class, 'id_organizador', 'id_usuario');
    }
}
