<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TipoNoticia extends Model
{
    use HasFactory;

    protected $table = 'tipo_noticia';
    protected $primaryKey = 'id_tipo_noticia';
    
    const CREATED_AT = 'data_criacao';
    const UPDATED_AT = 'data_modificacao';

    protected $fillable = [
        'tabela_noticia'
    ];
}
