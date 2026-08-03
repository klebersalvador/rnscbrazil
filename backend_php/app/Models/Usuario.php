<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class Usuario extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    protected $table = 'usuario';
    protected $primaryKey = 'id_usuario';
    public $timestamps = false;

    protected $fillable = [
        'nome', 'apelido', 'data_nascimento', 'sexo', 'cpf', 'rg', 'email', 
        'cep', 'estado', 'cidade', 'bairro', 'logradouro', 'numero', 'telefone',
        'competidor', 'filiado', 'id_perfil', 'handicap', 'login', 'senha', 'ativo', 
        'excluido', 'pendente', 'trio'
    ];

    protected $hidden = [
        'senha',
    ];

    public function getAuthPassword()
    {
        return $this->senha;
    }

    public function perfil()
    {
        return $this->belongsTo(Perfil::class, 'id_perfil', 'id_perfil');
    }
}
