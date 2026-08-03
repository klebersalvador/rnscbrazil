<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Usuario;
use Illuminate\Support\Facades\Hash;

class UsuarioController extends Controller
{
    // Rota: POST /usuarios/login
    public function login(Request $request)
    {
        $request->validate([
            'login' => 'required',
            'senha' => 'required'
        ]);

        $usuario = Usuario::where('login', $request->login)
                          ->where('ativo', 1)
                          ->first();

        // Suporta tanto o MD5 legado do banco antigo quanto o bcrypt padrão do Laravel
        if (! $usuario || ($usuario->senha !== md5($request->senha) && !Hash::check($request->senha, $usuario->senha))) { 
            return response()->json(['mensagem' => 'Credenciais inválidas'], 401);
        }

        return response()->json([
            'mensagem' => 'Login com sucesso',
            'token' => $usuario->createToken('auth_token')->plainTextToken,
            'usuario' => $usuario
        ]);
    }

    // Rota: GET /usuarios
    // Rota: GET /usuarios
    public function buscaTodos(Request $request)
    {
        $query = Usuario::with('perfil')->where('ativo', true);

        if ($request->has('q')) {
            $q = $request->q;
            $query->where(function($qBuilder) use ($q) {
                $qBuilder->where('nome', 'like', "%{$q}%")
                         ->orWhere('cpf', 'like', "%{$q}%");
            });
        }

        $limit = $request->input('limit', 100);
        $usuarios = $query->limit($limit)->get();
        
        return response()->json($usuarios);
    }

    // Rota: GET /usuarios/equipe
    public function buscaEquipe()
    {
        // Pega todos que não são apenas perfil Básico (3)
        $equipe = Usuario::with('perfil')
            ->where('id_perfil', '!=', 3)
            ->where('ativo', true)
            ->get();
        return response()->json($equipe);
    }

    public function buscaPorId($id)
    {
        $usuario = Usuario::with('perfil')->findOrFail($id);
        return response()->json($usuario);
    }

    public function checarCpf(Request $request, $cpf)
    {
        $cpfLimpo = preg_replace('/[^0-9]/', '', $cpf);
        
        $query = Usuario::where(function($q) use ($cpf, $cpfLimpo) {
            $q->where('cpf', $cpf)->orWhere('cpf', $cpfLimpo);
        });
        
        if ($request->has('ignore_id') && $request->ignore_id !== 'undefined' && $request->ignore_id !== 'null') {
            $query->where('id_usuario', '!=', $request->ignore_id);
        }
        
        $usuario = $query->first();
        
        if ($usuario) {
            return response()->json([
                'existe' => true,
                'usuario' => $usuario
            ]);
        }
        
        return response()->json(['existe' => false]);
    }

    public function cadastro(Request $request)
    {
        $request->validate([
            'nome' => 'required',
            'login' => 'required|unique:usuario,login',
            'cpf' => 'required|string|unique:usuario,cpf'
        ]);

        $data = $request->all();
        // Criptografar a senha se fornecida
        if (isset($data['senha'])) {
            $data['senha'] = md5($data['senha']); // Legado ou Hash::make se for o novo
        }
        $data['ativo'] = 1;
        if (!isset($data['id_perfil'])) {
            $data['id_perfil'] = 3; // Perfil Básico/Competidor
        }
        // Evita erro 1364 de campos obrigatórios no MySQL que não possuem default
        $data['sexo'] = $data['sexo'] ?? 'M';
        $data['data_nascimento'] = $data['data_nascimento'] ?? '2000-01-01';
        $data['rg'] = $data['rg'] ?? '';
        $data['email'] = $data['email'] ?? '';
        $data['telefone'] = $data['telefone'] ?? '';
        $data['apelido'] = $data['apelido'] ?? '';
        
        // Flags booleanas e numéricas
        $data['competidor'] = $data['competidor'] ?? 1; // 1 porque é um competidor se cadastrando
        $data['filiado'] = $data['filiado'] ?? 0;
        $data['handicap'] = $data['handicap'] ?? 0;
        $data['excluido'] = $data['excluido'] ?? 0;
        $data['pendente'] = $data['pendente'] ?? 0;
        $data['trio'] = $data['trio'] ?? 0;
        
        // Endereço
        $data['cep'] = $data['cep'] ?? '';
        $data['estado'] = $data['estado'] ?? '';
        $data['cidade'] = $data['cidade'] ?? '';
        $data['bairro'] = $data['bairro'] ?? '';
        $data['logradouro'] = $data['logradouro'] ?? '';
        $data['numero'] = $data['numero'] ?? '';
        
        $usuario = Usuario::create($data);
        return response()->json($usuario, 201);
    }

    public function altera(Request $request, $id)
    {
        $request->validate([
            'nome' => 'required',
            'login' => 'required|unique:usuario,login,' . $id . ',id_usuario',
            'cpf' => 'required|string|unique:usuario,cpf,' . $id . ',id_usuario'
        ]);

        $usuario = Usuario::findOrFail($id);
        $data = $request->all();
        
        if (!empty($data['senha'])) {
            $data['senha'] = md5($data['senha']); // Ou Hash::make
        } else {
            unset($data['senha']); // Não atualiza se vier vazio
        }

        $usuario->update($data);
        return response()->json($usuario);
    }

    public function excluir($id)
    {
        $usuario = Usuario::findOrFail($id);
        $usuario->update(['ativo' => 0]); // Soft delete ou inativar
        return response()->json(['mensagem' => 'Usuário excluído com sucesso']);
    }
}
