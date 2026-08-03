<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Inscricao;
use App\Models\Prova;
use App\Models\InscricaoCompetidor;
use Illuminate\Support\Facades\DB;

class ResultadoController extends Controller
{
    /**
     * Salvar resultado de uma inscrição (passada)
     */
    public function salvarResultado(Request $request, $id_inscricao)
    {
        $validated = $request->validate([
            'bois' => 'nullable|integer|min:0|max:10',
            'tempo' => 'nullable|numeric|min:0',
            'sat' => 'required|boolean',
            'fase' => 'nullable|integer|in:1,2,3'
        ]);

        $inscricao = Inscricao::findOrFail($id_inscricao);
        $fase = $validated['fase'] ?? 1;
        
        $bois = $validated['sat'] ? 0 : $validated['bois'];
        $tempo = $validated['sat'] ? null : $validated['tempo'];
        $sat = $validated['sat'] ? 1 : 0;
        
        if ($fase == 1) {
            $inscricao->bois = $bois;
            $inscricao->tempo = $tempo;
            $inscricao->sat = $sat;
        } elseif ($fase == 2) {
            $inscricao->bois_sf = $bois;
            $inscricao->tempo_sf = $tempo;
            $inscricao->sat_sf = $sat;
        } elseif ($fase == 3) {
            $inscricao->bois_f = $bois;
            $inscricao->tempo_f = $tempo;
            $inscricao->sat_f = $sat;
        }

        $inscricao->save();

        // Recalcular classificação automaticamente após cada inserção para manter o ranking vivo
        $this->atualizarClassificacaoProva($inscricao->id_prova);

        return response()->json(['message' => 'Resultado salvo com sucesso', 'inscricao' => $inscricao]);
    }

    /**
     * Calcular classificação final de uma prova via API (Pode ser chamado num botão de "Fechar Prova")
     */
    public function calcularClassificacaoAPI($id_prova)
    {
        $this->atualizarClassificacaoProva($id_prova);
        return response()->json(['message' => 'Classificação atualizada com sucesso']);
    }

    /**
     * Obter o Ranking da Prova (Placar Geral) formatado.
     * Retorna Inscrições (Duplas) ou Competidores Individuais (Todos contra Todos).
     */
    public function getClassificacaoGeralAPI($id_prova)
    {
        $prova = Prova::with('divisao')->find($id_prova);
        $isTodosContraTodos = $prova->divisao && $prova->divisao->is_todos_contra_todos;
        
        $regrasPontuacao = [];
        if ($prova && $prova->evento && $prova->evento->campeonato && $prova->evento->campeonato->pontuacao) {
            $regrasPontuacao = $prova->evento->campeonato->pontuacao->regras_json ?? [];
        }

        if ($isTodosContraTodos) {
            $ranking = $this->rankCompetidoresIndividuais($id_prova, $regrasPontuacao);
            return response()->json([
                'tipo' => 'individual',
                'ranking' => $ranking
            ]);
        } else {
            // Retorna as inscrições ordenadas pela classificação
            $inscricoes = Inscricao::with('competidores.competidor', 'competidores.cavalo')
                ->where('id_prova', $id_prova)
                ->where('excluido', 0)
                ->where('draw', 0)
                ->get();
            
            $ranking = $inscricoes->sort(function($a, $b) {
                if ($a->sat !== $b->sat) return $a->sat ? 1 : -1;
                if (!isset($a->classificacao) && isset($b->classificacao)) return 1;
                if (isset($a->classificacao) && !isset($b->classificacao)) return -1;
                return ($a->classificacao ?? 999) <=> ($b->classificacao ?? 999);
            })->values();

            return response()->json([
                'tipo' => 'dupla',
                'ranking' => $ranking
            ]);
        }
    }

    /**
     * Lógica interna de ordenação do Ranking
     */
    private function atualizarClassificacaoProva($id_prova)
    {
        $prova = Prova::with(['divisao', 'evento.campeonato.pontuacao'])->find($id_prova);
        $isTodosContraTodos = $prova->divisao && $prova->divisao->is_todos_contra_todos;

        $regrasPontuacao = [];
        if ($prova && $prova->evento && $prova->evento->campeonato && $prova->evento->campeonato->pontuacao) {
            $regrasPontuacao = $prova->evento->campeonato->pontuacao->regras_json ?? [];
        }

        if ($isTodosContraTodos) {
            $this->rankCompetidoresIndividuais($id_prova, $regrasPontuacao);
            return;
        }

        // Lógica tradicional (Por Inscrição / Dupla)
        $inscricoes = Inscricao::where('id_prova', $id_prova)
            ->where('excluido', 0)
            ->where('draw', 0)
            ->get();

        $inscricoes = $inscricoes->sort(function($a, $b) {
            if ($a->sat != $b->sat) {
                return $a->sat ? 1 : -1; 
            }

            $a_rodou = (isset($a->bois) || $a->sat);
            $b_rodou = (isset($b->bois) || $b->sat);

            if ($a_rodou && !$b_rodou) return -1;
            if (!$a_rodou && $b_rodou) return 1;
            if (!$a_rodou && !$b_rodou) return 0; 
            
            $a_total_bois = ($a->bois ?? 0) + ($a->bois_sf ?? 0) + ($a->bois_f ?? 0);
            $a_total_tempo = ($a->tempo ?? 0) + ($a->tempo_sf ?? 0) + ($a->tempo_f ?? 0);
            
            $b_total_bois = ($b->bois ?? 0) + ($b->bois_sf ?? 0) + ($b->bois_f ?? 0);
            $b_total_tempo = ($b->tempo ?? 0) + ($b->tempo_sf ?? 0) + ($b->tempo_f ?? 0);

            if ($a_total_bois != $b_total_bois) {
                return $b_total_bois - $a_total_bois; 
            }

            if ($a_total_tempo != $b_total_tempo) {
                return $a_total_tempo <=> $b_total_tempo;
            }

            return 0;
        });

        $posicao = 1;
        foreach ($inscricoes as $insc) {
            if ($insc->sat || !isset($insc->bois)) {
                $insc->classificacao = null;
                $pontos = 0;
            } else {
                $insc->classificacao = $posicao;
                $pontos = isset($regrasPontuacao[$posicao]) ? (int)$regrasPontuacao[$posicao] : 0;
                
                if (empty($regrasPontuacao)) {
                    $pontos = max(0, 11 - $posicao);
                }
                
                $posicao++;
            }
            $insc->save();

            $competidores = InscricaoCompetidor::where('id_inscricao', $insc->id_inscricao)->get();
            foreach($competidores as $comp) {
                $comp->pontos_campeonato = $pontos;
                $comp->save();
            }
        }
    }

    /**
     * Calcula o ranking individual agregando os bois e tempos
     */
    private function rankCompetidoresIndividuais($id_prova, $regrasPontuacao)
    {
        $inscricoes = Inscricao::with('competidores.competidor', 'competidores.cavalo')
            ->where('id_prova', $id_prova)
            ->where('excluido', 0)
            ->where('draw', 0)
            ->get();

        $competidores = [];

        foreach ($inscricoes as $insc) {
            $tBois = ($insc->bois ?? 0) + ($insc->bois_sf ?? 0) + ($insc->bois_f ?? 0);
            $tTempo = ($insc->tempo ?? 0) + ($insc->tempo_sf ?? 0) + ($insc->tempo_f ?? 0);
            
            if ($insc->sat) {
                $tBois = 0;
                $tTempo = 0;
            }
            
            foreach ($insc->competidores as $comp) {
                $cId = $comp->id_competidor;
                if (!isset($competidores[$cId])) {
                    $competidores[$cId] = [
                        'id_competidor' => $cId,
                        'nome' => $comp->competidor->nome ?? 'Desconhecido',
                        'cavalo' => $comp->cavalo->nome ?? 'Indefinido',
                        'bois' => 0,
                        'tempo' => 0,
                        'rodou' => false,
                        'inscricao_competidor_ids' => []
                    ];
                }
                
                $competidores[$cId]['inscricao_competidor_ids'][] = $comp->id_inscricao_competidor;

                if (isset($insc->bois) || $insc->sat) {
                    $competidores[$cId]['rodou'] = true;
                    $competidores[$cId]['bois'] += $tBois;
                    $competidores[$cId]['tempo'] += $tTempo;
                }
            }
        }

        // Ordenar: Maior bois, menor tempo
        usort($competidores, function($a, $b) {
            if (!$a['rodou'] && !$b['rodou']) return 0;
            if ($a['rodou'] && !$b['rodou']) return -1;
            if (!$a['rodou'] && $b['rodou']) return 1;

            if ($a['bois'] != $b['bois']) {
                return $b['bois'] - $a['bois'];
            }
            
            if ($a['tempo'] != $b['tempo']) {
                return $a['tempo'] <=> $b['tempo'];
            }
            
            return 0;
        });

        $posicao = 1;
        
        // Zera todos os pontos da prova primeiro
        InscricaoCompetidor::whereHas('inscricao', function($q) use ($id_prova) {
            $q->where('id_prova', $id_prova);
        })->update(['pontos_campeonato' => 0]);

        foreach ($competidores as &$c) {
            if (!$c['rodou']) {
                $c['classificacao'] = null;
                $pontos = 0;
            } else {
                $c['classificacao'] = $posicao;
                $pontos = isset($regrasPontuacao[$posicao]) ? (int)$regrasPontuacao[$posicao] : 0;
                if (empty($regrasPontuacao)) {
                    $pontos = max(0, 11 - $posicao);
                }
                $posicao++;
            }

            if ($pontos > 0 && count($c['inscricao_competidor_ids']) > 0) {
                // Distribui os pontos do campeonato apenas na primeira inscrição para não multiplicar
                InscricaoCompetidor::where('id_inscricao_competidor', $c['inscricao_competidor_ids'][0])
                    ->update(['pontos_campeonato' => $pontos]);
            }
        }
        
        return $competidores;
    }
}
