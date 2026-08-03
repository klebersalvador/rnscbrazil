<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class RegraAplicante extends Model
{
    use HasFactory;

    protected $table = 'regra_aplicante';
    protected $primaryKey = 'id_regra_aplicante';
    
    const CREATED_AT = 'data_criacao';
    const UPDATED_AT = 'data_modificacao';

    protected $fillable = [
        'descricao'
    ];
}
