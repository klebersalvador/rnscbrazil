<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TipoArquivo extends Model
{
    use HasFactory;

    protected $table = 'tipo_arquivo';
    protected $primaryKey = 'id_tipo_arquivo';
    
    const CREATED_AT = 'data_criacao';
    const UPDATED_AT = 'data_modificacao';

    protected $fillable = [
        'tipo_arquivo'
    ];
}
