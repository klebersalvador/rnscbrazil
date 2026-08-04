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
        try {
            $data = $request->all();
            // Set default values for required non-nullable fields
            $data['id_organizador'] = $request->user()->id_usuario ?? 1;
            $data['website'] = $data['website'] ?? '';
            $data['imagem_exibicao'] = $data['imagem_exibicao'] ?? 'default.jpg';
            $data['data_inicio_inscricoes'] = $data['data_inicio_inscricoes'] ?? now()->format('Y-m-d H:i:s');
            $data['data_fim_inscricoes'] = $data['data_fim_inscricoes'] ?? now()->addDays(7)->format('Y-m-d H:i:s');
            
            $data['titulo'] = $data['titulo'] ?? 'Sem título';
            $data['descricao'] = $data['descricao'] ?? '';
            $data['localizacao'] = $data['localizacao'] ?? '';
            
            if (!empty($data['data_inicial'])) {
                $data['data_inicial'] = date('Y-m-d H:i:s', strtotime($data['data_inicial']));
            }
            if (!empty($data['data_final'])) {
                $data['data_final'] = date('Y-m-d H:i:s', strtotime($data['data_final']));
            }
            
            $data['finalizado'] = 0;

            if ($request->hasFile('cartaz')) {
                $file = $request->file('cartaz');
                $filename = time() . '_' . preg_replace('/[^A-Za-z0-9\-_\.]/', '', $file->getClientOriginalName());
                $file->move(public_path('cartazes'), $filename);
                $data['imagem_exibicao'] = 'cartazes/' . $filename;
            }

            $evento = Evento::create($data);
            return response()->json($evento, 201);
        } catch (\Exception $e) {
            file_put_contents(public_path('ultimo_erro_evento.txt'), date('Y-m-d H:i:s') . " - ERRO INSERE: " . $e->getMessage() . "\nDados: " . json_encode($request->all()));
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    public function altera(Request $request, $id)
    {
        try {
            $data = $request->all();
            
            if (array_key_exists('titulo', $data)) {
                $data['titulo'] = $data['titulo'] ?? 'Sem título';
            }
            if (array_key_exists('descricao', $data)) {
                $data['descricao'] = $data['descricao'] ?? '';
            }
            if (array_key_exists('localizacao', $data)) {
                $data['localizacao'] = $data['localizacao'] ?? '';
            }
            
            if (!empty($data['data_inicial'])) {
                $data['data_inicial'] = date('Y-m-d H:i:s', strtotime($data['data_inicial']));
            }
            if (!empty($data['data_final'])) {
                $data['data_final'] = date('Y-m-d H:i:s', strtotime($data['data_final']));
            }

            if ($request->hasFile('cartaz')) {
                $file = $request->file('cartaz');
                $filename = time() . '_' . preg_replace('/[^A-Za-z0-9\-_\.]/', '', $file->getClientOriginalName());
                $file->move(public_path('cartazes'), $filename);
                $data['imagem_exibicao'] = 'cartazes/' . $filename;
            }

            $evento = Evento::findOrFail($id);
            $evento->update($data);
            return response()->json($evento);
        } catch (\Exception $e) {
            file_put_contents(public_path('ultimo_erro_evento.txt'), date('Y-m-d H:i:s') . " - ERRO ALTERA: " . $e->getMessage() . "\nDados: " . json_encode($request->all()));
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    public function deleta($id)
    {
        $evento = Evento::findOrFail($id);
        $evento->delete();
        return response()->json(['mensagem' => 'Evento excluído com sucesso']);
    }
}
