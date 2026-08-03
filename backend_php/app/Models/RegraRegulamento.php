<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class RegraRegulamento extends Model
{
    use HasFactory;

    protected $table = 'regra_regulamento';
    protected $primaryKey = 'id_regra_regulamento';
    
    const CREATED_AT = 'data_criacao';
    const UPDATED_AT = 'data_modificacao';

    protected $fillable = [
        'titulo', 'texto', 'data_cadastramento', 'ativo'
    ];
}
