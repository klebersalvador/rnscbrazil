<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Cavalo extends Model
{
    use HasFactory;

    protected $table = 'cavalo';
    protected $primaryKey = 'id_cavalo';
    
    const CREATED_AT = 'data_criacao';
    const UPDATED_AT = 'data_modificacao';

    protected $fillable = [
        'ativo', 'data_criacao', 'data_modificacao', 'nascimento', 'nome', 
        'id_proprietario', 'registro', 'rsnc', 'site', 'id_raca', 'sexo_animal',
        'id_unidade_federativa', 'cidade', 'nome_proprietario', 'pendente'
    ];

    public function proprietario()
    {
        return $this->belongsTo(Usuario::class, 'id_proprietario', 'id_usuario');
    }
}
