<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Destaque extends Model
{
    use HasFactory;

    protected $table = 'destaque';
    protected $primaryKey = 'id_destaque';
    
    const CREATED_AT = 'data_criacao';
    const UPDATED_AT = 'data_modificacao';

    protected $fillable = [
        'titulo', 'texto', 'endereco', 'tipo_destaque', 'data_cadastramento', 'ativo'
    ];
}
