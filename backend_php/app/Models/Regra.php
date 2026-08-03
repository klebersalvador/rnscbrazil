<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Regra extends Model
{
    use HasFactory;

    protected $table = 'regra';
    protected $primaryKey = 'id_regra';
    
    const CREATED_AT = 'data_criacao';
    const UPDATED_AT = 'data_modificacao';

    protected $fillable = [
        'nome', 'descricao', 'expressao', 'parametros', 'tipo_regra', 'regra_aplicante'
    ];
    public function divisoes()
    {
        return $this->belongsToMany(Divisao::class, 'divisao_regras', 'id_regra', 'id_divisao');
    }
}
