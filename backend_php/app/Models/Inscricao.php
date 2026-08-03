<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Inscricao extends Model
{
    use HasFactory;

    protected $table = 'inscricao';
    protected $primaryKey = 'id_inscricao';
    
    public $timestamps = false;

    protected $fillable = [
        'data_inscricao', 'id_prova', 'id_cadastrador', 'excluido', 'draw',
        'id_evento', 'tipo_inscricao', 'data_modificacao',
        'ordem_entrada', 'bois', 'tempo', 'sat', 'classificacao',
        'bois_sf', 'tempo_sf', 'sat_sf', 'bois_f', 'tempo_f', 'sat_f'
    ];

    public function prova()
    {
        return $this->belongsTo(Prova::class, 'id_prova', 'id_prova');
    }

    public function cadastrador()
    {
        return $this->belongsTo(Usuario::class, 'id_cadastrador', 'id_usuario');
    }

    public function evento()
    {
        return $this->belongsTo(Evento::class, 'id_evento', 'id_evento');
    }

    public function competidores()
    {
        return $this->hasMany(InscricaoCompetidor::class, 'id_inscricao', 'id_inscricao');
    }
}
