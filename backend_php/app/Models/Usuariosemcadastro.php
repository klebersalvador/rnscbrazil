<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Usuariosemcadastro extends Model
{
    use HasFactory;

    protected $table = 'usuariosemcadastro';
    protected $primaryKey = 'id_usuario';
    
    const CREATED_AT = 'data_criacao';
    const UPDATED_AT = 'data_modificacao';

    protected $fillable = [
        'nome', 'data_nascimento', 'sexo', 'telefone', 'handicap', 'ativo', 'pendente', 'excluido'
    ];
}
