<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class RespostaHandicap extends Model
{
    use HasFactory;

    protected $table = 'resposta_handicap';
    protected $primaryKey = 'id_resposta_handicap';
    
    const CREATED_AT = 'data_criacao';
    const UPDATED_AT = 'data_modificacao';

    protected $fillable = [
        'resposta', 'handicap', 'id_pergunta', 'id_proxima_pergunta'
    ];
}
