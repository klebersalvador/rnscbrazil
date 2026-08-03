<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class RespostaPergunta extends Model
{
    use HasFactory;

    protected $table = 'resposta_pergunta';
    protected $primaryKey = 'id_resposta_pergunta';
    
    const CREATED_AT = 'data_criacao';
    const UPDATED_AT = 'data_modificacao';

    protected $fillable = [
        'id_pergunta', 'id_usuario', 'id_resposta', 'sem_cadastro'
    ];
}
