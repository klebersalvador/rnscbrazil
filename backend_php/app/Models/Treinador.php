<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Treinador extends Model
{
    use HasFactory;

    protected $table = 'treinador';
    protected $primaryKey = 'id_treinador';
    
    const CREATED_AT = 'data_criacao';
    const UPDATED_AT = 'data_modificacao';

    protected $fillable = [
        'nome', 'email', 'id_unidade_federativa', 'cidade', 'local', 'telefone', 'observacoes', 'imagem_exibicao'
    ];
}
