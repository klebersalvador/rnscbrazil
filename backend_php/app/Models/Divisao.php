<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Divisao extends Model
{
    use HasFactory;

    protected $table = 'divisao';
    protected $primaryKey = 'id_divisao';
    
    const CREATED_AT = 'data_criacao';
    const UPDATED_AT = 'data_modificacao';

    protected $fillable = [
        'nome', 'ativo', 'data_criacao', 'data_modificacao', 'nao_pontuar',
        'nao_premiar', 'nao_exigir_cadastro', 'tempo_divisao', 'rebatedor_apartador',
        'id_raca', 'id_tipo_inscricao', 'somatorio_minimo', 'somatorio_maximo',
        'potro_futuro', 'tempo_diferencia', 'is_todos_contra_todos'
    ];
    public function regras()
    {
        return $this->belongsToMany(Regra::class, 'divisao_regras', 'id_divisao', 'id_regra')
                    ->withPivot('parametro1', 'parametro2', 'parametro3', 'parametro4');
    }
}
