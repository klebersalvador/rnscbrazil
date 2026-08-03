<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class RegraDivisao extends Model
{
    use HasFactory;

    protected $table = 'regra_divisao';
    protected $primaryKey = 'id_regra_divisao';
    
    const CREATED_AT = 'data_criacao';
    const UPDATED_AT = 'data_modificacao';

    protected $fillable = [
        'descricao', 'expressao', 'parametros', 'id_divisao', 'numero_competidor', 'regra_aplicante'
    ];
}
