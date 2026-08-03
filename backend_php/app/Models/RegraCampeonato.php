<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class RegraCampeonato extends Model
{
    use HasFactory;

    protected $table = 'regra_campeonato';
    protected $primaryKey = 'id_regra_campeonato';
    
    const CREATED_AT = 'data_criacao';
    const UPDATED_AT = 'data_modificacao';

    protected $fillable = [
        'descricao', 'expressao', 'parametros', 'id_campeonato'
    ];
}
