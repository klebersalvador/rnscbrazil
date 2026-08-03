<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class RegraEvento extends Model
{
    use HasFactory;

    protected $table = 'regra_evento';
    protected $primaryKey = 'id_regra_evento';
    
    const CREATED_AT = 'data_criacao';
    const UPDATED_AT = 'data_modificacao';

    protected $fillable = [
        'descricao', 'expressao', 'parametros', 'id_evento'
    ];
}
