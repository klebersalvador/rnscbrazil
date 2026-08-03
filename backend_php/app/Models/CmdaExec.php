<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CmdaExec extends Model
{
    use HasFactory;

    protected $table = 'cmda_exec';
    protected $primaryKey = 'id';
    
    const CREATED_AT = 'data_criacao';
    const UPDATED_AT = 'data_modificacao';

    protected $fillable = [
        'cmda_output'
    ];
}
