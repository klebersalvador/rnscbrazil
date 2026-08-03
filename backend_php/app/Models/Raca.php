<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Raca extends Model
{
    protected $table = 'raca';
    protected $primaryKey = 'id_raca';
    public $timestamps = false;

    protected $fillable = [
        'abreviacao',
        'descricao',
        'data_criacao',
        'data_modificacao'
    ];
}
