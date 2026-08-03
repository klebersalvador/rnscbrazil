<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class UsuariosemcadastroInscricaoCompetidor extends Model
{
    use HasFactory;

    protected $table = 'usuariosemcadastro_inscricao_competidor';
    protected $primaryKey = 'id_inscricao_competidor';
    
    const CREATED_AT = 'data_criacao';
    const UPDATED_AT = 'data_modificacao';

    protected $fillable = [
        'id_usuario', 'data_cadastramento', 'ativo', 'id_usuariosemcad_inscricao_competidor'
    ];
}
