<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Perfil;

class PerfilController extends Controller
{
    public function index()
    {
        $perfis = Perfil::orderBy('id_perfil')->get();
        return response()->json($perfis);
    }
}
