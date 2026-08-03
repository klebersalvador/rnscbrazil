<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Pontuacao extends Model
{
    use HasFactory;

    protected $table = 'pontuacaos';
    protected $primaryKey = 'id_pontuacao';

    protected $fillable = [
        'nome',
        'tipo',
        'regras_json',
        'ativo'
    ];

    protected $casts = [
        'regras_json' => 'array',
        'ativo' => 'boolean'
    ];
}
