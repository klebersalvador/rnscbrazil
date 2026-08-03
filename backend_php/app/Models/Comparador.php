<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Comparador extends Model
{
    use HasFactory;

    protected $table = 'comparador';
    protected $primaryKey = 'id_comparador';
    
    const CREATED_AT = 'data_criacao';
    const UPDATED_AT = 'data_modificacao';

    protected $fillable = [
        'valor', 'descricao'
    ];
}
