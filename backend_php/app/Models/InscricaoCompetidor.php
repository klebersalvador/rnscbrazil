<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class InscricaoCompetidor extends Model
{
    use HasFactory;

    protected $table = 'inscricao_competidor';
    protected $primaryKey = 'id_inscricao_competidor';
    
    const CREATED_AT = null; // Tabela não possui data_criacao
    const UPDATED_AT = 'data_modificacao';

    protected $fillable = [
        'id_inscricao', 'id_competidor', 'id_cavalo', 'is_apartador', 'inscricao_paga', 'tempo_previsto', 'handicap_competidor', 'excluido', 'potro_futuro', 'sem_cadastro', 'pontos_campeonato'
    ];

    public function competidor()
    {
        return $this->belongsTo(Usuario::class, 'id_competidor', 'id_usuario');
    }

    public function cavalo()
    {
        return $this->belongsTo(Cavalo::class, 'id_cavalo', 'id_cavalo');
    }

    public function inscricao()
    {
        return $this->belongsTo(Inscricao::class, 'id_inscricao', 'id_inscricao');
    }
}
