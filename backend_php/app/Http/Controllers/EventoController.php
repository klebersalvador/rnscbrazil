<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Evento;

class EventoController extends Controller
{
    public function buscaTodos(Request $request)
    {
        $limit = $request->query('limit', 100);
        $offset = $request->query('offset', 0);
        
        $eventos = Evento::with(['organizador', 'campeonato'])
            ->where('finalizado', false)
            ->orderBy('id_evento', 'desc')
            ->offset($offset)
            ->limit($limit)
            ->get();
            
        return response()->json($eventos);
    }

    public function buscarFiltro(Request $request)
    {
        $filtro = $request->input('filtro', []);
        $query = Evento::with(['organizador', 'campeonato']);
        
        if (!empty($filtro['titulo'])) {
            $query->where('titulo', 'like', '%' . $filtro['titulo'] . '%');
        }
        if (isset($filtro['finalizado'])) {
            $query->where('finalizado', $filtro['finalizado']);
        }
        
        $limit = $request->query('limit', 10);
        $offset = $request->query('offset', 0);
        
        $eventos = $query->offset($offset)->limit($limit)->get();
        return response()->json($eventos);
    }

    public function buscaPorId($id)
    {
        $evento = Evento::with(['organizador', 'campeonato'])->findOrFail($id);
        return response()->json($evento);
    }

    public function insere(Request $request)
    {
        $data = $request->all();
        // Set default values for required non-nullable fields
        $data['id_organizador'] = $request->user()->id_usuario ?? 1;
        $data['website'] = $data['website'] ?? '';
        $data['imagem_exibicao'] = $data['imagem_exibicao'] ?? 'default.jpg';
        $data['data_inicio_inscricoes'] = $data['data_inicio_inscricoes'] ?? now();
        $data['data_fim_inscricoes'] = $data['data_fim_inscricoes'] ?? now()->addDays(7);
        $data['finalizado'] = 0;

        $evento = Evento::create($data);
        return response()->json($evento, 201);
    }

    public function altera(Request $request, $id)
    {
        $evento = Evento::findOrFail($id);
        $evento->update($request->all());
        return response()->json($evento);
    }

    public function deleta($id)
    {
        $evento = Evento::findOrFail($id);
        $evento->delete();
        return response()->json(['mensagem' => 'Evento excluído com sucesso']);
    }
}
