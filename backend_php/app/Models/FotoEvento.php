<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class FotoEvento extends Model
{
    use HasFactory;

    protected $table = 'foto_evento';
    protected $primaryKey = 'id_foto_evento';
    
    const CREATED_AT = 'data_criacao';
    const UPDATED_AT = 'data_modificacao';

    protected $fillable = [
        'id_evento', 'id_cadastrador', 'link'
    ];
}
