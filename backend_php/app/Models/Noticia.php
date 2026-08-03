<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Noticia extends Model
{
    use HasFactory;

    protected $table = 'noticia';
    protected $primaryKey = 'id_noticia';
    
    const CREATED_AT = 'data_criacao';
    const UPDATED_AT = 'data_modificacao';

    protected $fillable = [
        'titulo', 'texto', 'id_autor', 'id_tipo_noticia', 'id_referencia_noticia', 'imagem_exibicao', 'ativa', 'id_tipo_arquivo'
    ];
}
