<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Inscricao;
use App\Models\InscricaoCompetidor;
use App\Models\Prova;
use Illuminate\Support\Facades\DB;

class SorteioController extends Controller
{
    public function gerarSorteio($id_prova)
    {
        try {
            DB::beginTransaction();

            $prova = Prova::with('divisao')->findOrFail($id_prova);
            $isTodosContraTodos = $prova->divisao && $prova->divisao->is_todos_contra_todos;

            // 1. Encontrar todos os "Draws" (draw = 1 e excluido = 0)
            $draws = Inscricao::where('id_prova', $id_prova)
                ->where('draw', 1)
                ->where('excluido', 0)
                ->with('competidores')
                ->get();

            // Desmontar os draws em uma lista de competidores isolados
            $competidoresSorteio = [];
            foreach ($draws as $draw) {
                foreach ($draw->competidores as $comp) {
                    $competidoresSorteio[] = [
                        'inscricao' => $draw,
                        'inscricao_competidor' => $comp
                    ];
                }
            }

            // Embaralhar para o sorteio ser aleatório
            shuffle($competidoresSorteio);

            if ($isTodosContraTodos) {
                // Todos contra Todos: cruzar todos os competidores
                $count = count($competidoresSorteio);
                for ($i = 0; $i < $count - 1; $i++) {
                    for ($j = $i + 1; $j < $count; $j++) {
                        $c1 = $competidoresSorteio[$i];
                        $c2 = $competidoresSorteio[$j];
                        
                        $baseInscricao = $c1['inscricao'];
                        $novaInscricao = $baseInscricao->replicate();
                        $novaInscricao->draw = 0;
                        $novaInscricao->save();
                        
                        $comp1 = $c1['inscricao_competidor']->replicate();
                        $comp1->id_inscricao = $novaInscricao->id_inscricao;
                        $comp1->save();
                        
                        $comp2 = $c2['inscricao_competidor']->replicate();
                        $comp2->id_inscricao = $novaInscricao->id_inscricao;
                        $comp2->save();
                    }
                }
                
                // Marcar as inscrições originais como excluídas
                foreach ($draws as $draw) {
                    $draw->excluido = 1;
                    $draw->save();
                }
            } else {
                // Formar as duplas (Tradicional)
                for ($i = 0; $i < count($competidoresSorteio); $i += 2) {
                    if (isset($competidoresSorteio[$i + 1])) {
                        $c1 = $competidoresSorteio[$i];
                        $c2 = $competidoresSorteio[$i + 1];

                        // Transformar o $c1 na inscrição "Principal" (já não é mais draw isolado)
                        $inscricaoPrincipal = $c1['inscricao'];
                        $inscricaoPrincipal->draw = 0; // Virou dupla fixa
                        $inscricaoPrincipal->save();

                        // Transferir o competidor 2 para a inscrição principal
                        $comp2 = $c2['inscricao_competidor'];
                        $comp2->id_inscricao = $inscricaoPrincipal->id_inscricao;
                        $comp2->save();

                        // Marcar a inscrição original do competidor 2 como excluída
                        $inscricaoSecundaria = $c2['inscricao'];
                        $inscricaoSecundaria->excluido = 1;
                        $inscricaoSecundaria->save();
                    } else {
                        // Sobrou 1 (ímpar), continua como draw = 1 (Aguardando/Sorteio pendente)
                    }
                }
            }

            // 2. Pegar todas as inscrições válidas e embaralhar para definir Ordem de Entrada
            $todasInscricoes = Inscricao::where('id_prova', $id_prova)
                ->where('excluido', 0)
                ->get();

            $inscricoesArray = $todasInscricoes->all();
            shuffle($inscricoesArray);

            $ordem = 1;
            foreach ($inscricoesArray as $insc) {
                $insc->ordem_entrada = $ordem++;
                
                // Limpar todos os resultados anteriores (caso o sorteio seja refeito)
                $insc->bois = null;
                $insc->tempo = null;
                $insc->sat = 0;
                $insc->bois_sf = null;
                $insc->tempo_sf = null;
                $insc->sat_sf = 0;
                $insc->bois_f = null;
                $insc->tempo_f = null;
                $insc->sat_f = 0;
                $insc->classificacao = null;
                
                $insc->save();

                // Limpar pontos distribuídos
                InscricaoCompetidor::where('id_inscricao', $insc->id_inscricao)
                    ->update(['pontos_campeonato' => 0]);
            }

            DB::commit();

            return response()->json(['mensagem' => 'Sorteio realizado e ordem gerada com sucesso!']);
        } catch (\Exception $e) {
            DB::rollBack();
            \Log::error("Erro no sorteio: " . $e->getMessage() . " - " . $e->getTraceAsString());
            return response()->json(['erro' => 'Erro ao processar sorteio: ' . $e->getMessage()], 400);
        }
    }
}
