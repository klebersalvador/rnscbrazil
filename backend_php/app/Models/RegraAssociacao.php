<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class RegraAssociacao extends Model
{
    use HasFactory;

    protected $table = 'regra_associacao';
    protected $primaryKey = 'id_regra_associacao';
    
    const CREATED_AT = 'data_criacao';
    const UPDATED_AT = 'data_modificacao';

    protected $fillable = [
        'nome', 'descricao', 'regra', 'expressao', 'parametros'
    ];
}
