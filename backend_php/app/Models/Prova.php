<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Prova extends Model
{
    use HasFactory;

    protected $table = 'prova';
    protected $primaryKey = 'id_prova';
    
    const CREATED_AT = 'data_criacao';
    const UPDATED_AT = 'data_modificacao';

    protected $fillable = [
        'data_criacao', 'data_finalizacao', 'data_modificacao', 'prova_finalizada',
        'tipo_prova', 'id_evento', 'id_divisao', 'iniciada', 'handicap_minimo_prova',
        'numero_maximo_inscricao_competidor', 'qtd_maxima_inscricao_dupla',
        'qtd_maxima_competidor', 'qtd_maxima_inscricao_cavalo', 'draw',
        'preco_inscricao', 'inscricao_bloqueada', 'porcentagem_premiacao',
        'somatorio_minimo', 'somatorio_maximo', 'taxa_administrativa',
        'incremento_premiacao', 'descricao', 'qtd_maxima_inscricao_trio',
        'qtd_maxima_inscricao', 'configuracao_fases'
    ];

    protected $casts = [
        'configuracao_fases' => 'array',
    ];

    public function evento()
    {
        return $this->belongsTo(Evento::class, 'id_evento', 'id_evento');
    }

    public function divisao()
    {
        return $this->belongsTo(Divisao::class, 'id_divisao', 'id_divisao');
    }

    public function inscricoes()
    {
        return $this->hasMany(Inscricao::class, 'id_prova', 'id_prova')->where('excluido', 0);
    }
}
