<?php

namespace App\Services;

use App\Models\Prova;
use App\Models\Evento;
use App\Models\Cavalo;
use App\Models\Inscricao;
use Illuminate\Support\Facades\DB;

class ValidaInscricaoService
{
    /**
     * Valida se a data atual está dentro do prazo de inscrição do evento.
     */
    public function validaPrazoInscricao($dataFimInscricoes)
    {
        if (!$dataFimInscricoes) {
            return false; // Sem prazo definido, permite
        }
        
        $agora = now();
        $fim = \Carbon\Carbon::parse($dataFimInscricoes);
        
        return $agora->greaterThan($fim); // Retorna true se passou do prazo
    }

    /**
     * Simula a validação pesada das regras da divisão.
     */
    public function verificaRegras($competidores, $regrasDaDivisao, $qtdInscricoesCavalo, $infoProva, $dadosInscricao = null)
    {
        if (count($competidores) === 0) return true;

        $somaHandicap = 0;
        $somaIdades = 0;
        $usuarios = [];

        foreach ($competidores as $comp) {
            $usuario = \App\Models\Usuario::find($comp['id_competidor']);
            if (!$usuario) throw new \Exception('Competidor não encontrado.');
            
            $handicap = floatval($usuario->handicap ?? 0);
            $somaHandicap += $handicap;
            
            $idade = 0;
            if ($usuario->data_nascimento && $usuario->data_nascimento != '0000-00-00 00:00:00' && $usuario->data_nascimento != '0000-00-00') {
                $idade = \Carbon\Carbon::parse($usuario->data_nascimento)->age;
            } else {
                // Se idade for 0 (ausente), marcamos como nulo para explodir na validação
                $idade = 'null'; 
            }
            $somaIdades += ($idade === 'null' ? 0 : $idade);

            $idadeCavalo = 'null';
            if (isset($comp['id_cavalo']) && $comp['id_cavalo']) {
                $cavalo = \App\Models\Cavalo::find($comp['id_cavalo']);
                if ($cavalo && $cavalo->nascimento && $cavalo->nascimento != '0000-00-00 00:00:00' && $cavalo->nascimento != '0000-00-00') {
                    $idadeCavalo = \Carbon\Carbon::parse($cavalo->nascimento)->age;
                }
            }

            $usuarios[] = [
                'usuario' => $usuario,
                'idade' => $idade,
                'idade_cavalo' => $idadeCavalo,
                'handicap' => $handicap,
                'sexo' => strtoupper(trim($usuario->sexo ?? '')),
                'potro_futuro' => isset($comp['potro_futuro']) && $comp['potro_futuro'] ? 1 : 0
            ];
        }

        $divisao = $infoProva->divisao;

        // Pré-calcular a quantidade de inscrições ativas para os limites
        $inscricoesProva = Inscricao::with('competidores')
            ->where('id_prova', $infoProva->id_prova)
            ->where('excluido', false)
            ->get();

        $idCompetidoresInput = array_column($competidores, 'id_competidor');
        sort($idCompetidoresInput);

        $qtdConjunto = 0;
        foreach ($inscricoesProva as $insc) {
            $inscIds = $insc->competidores->pluck('id_competidor')->toArray();
            sort($inscIds);
            if ($inscIds === $idCompetidoresInput) {
                $qtdConjunto++;
            }
        }

        $countsPorCompetidor = [];
        foreach ($competidores as $comp) {
            $idC = $comp['id_competidor'];
            $idCav = $comp['id_cavalo'] ?? null;
            
            $qtdInsc = 0;
            $qtdDraw = 0;
            $qtdCav = 0;

            foreach ($inscricoesProva as $insc) {
                $compRecord = $insc->competidores->firstWhere('id_competidor', $idC);
                if ($compRecord) {
                    $qtdInsc++;
                    if ($insc->draw) {
                        $qtdDraw++;
                    }
                }
                // Contar cavalo independentemente de ser deste competidor nesta inscrição,
                // caso o cavalo já tenha corrido com outra pessoa.
                if ($idCav) {
                    if ($insc->competidores->firstWhere('id_cavalo', $idCav)) {
                        $qtdCav++;
                    }
                }
            }

            $countsPorCompetidor[$idC] = [
                'inscricoes' => $qtdInsc,
                'draws' => $qtdDraw,
                'cavalo' => $qtdCav
            ];
        }

        $isDraw = false;
        \Log::info("Dados Inscrição recebidos na validação: " . json_encode($dadosInscricao));
        if ($dadosInscricao && isset($dadosInscricao['draw']) && $dadosInscricao['draw']) {
            $isDraw = true;
        }

        // Regra Padrão: Somatório de Handicap
        if (!is_null($divisao->somatorio_minimo) && $somaHandicap < $divisao->somatorio_minimo) {
            throw new \Exception("A soma do handicap da dupla ({$somaHandicap}) é menor que o mínimo exigido ({$divisao->somatorio_minimo}).");
        }
        if (!is_null($divisao->somatorio_maximo) && $somaHandicap > $divisao->somatorio_maximo) {
            throw new \Exception("A soma do handicap da dupla ({$somaHandicap}) ultrapassa o limite da divisão ({$divisao->somatorio_maximo}).");
        }

        // Regras Customizadas (Avaliadas via string simples para suportar +, -, >, <, ==)
        foreach ($regrasDaDivisao as $regra) {
            // Regra Aplicante: 1 = Ambos, 2 = Pelo Menos Um, 3 = Soma da Dupla
            $expressao = $regra->expressao;

            // Injetar os parâmetros dinâmicos se existirem
            if ($regra->pivot) {
                $p1 = (!is_null($regra->pivot->parametro1) && trim($regra->pivot->parametro1) !== '') ? $regra->pivot->parametro1 : '1';
                $expressao = str_ireplace('params[0]', $p1, $expressao);

                $p2 = (!is_null($regra->pivot->parametro2) && trim($regra->pivot->parametro2) !== '') ? $regra->pivot->parametro2 : '1';
                $expressao = str_ireplace('params[1]', $p2, $expressao);

                $p3 = (!is_null($regra->pivot->parametro3) && trim($regra->pivot->parametro3) !== '') ? $regra->pivot->parametro3 : '1';
                $expressao = str_ireplace('params[2]', $p3, $expressao);

                $p4 = (!is_null($regra->pivot->parametro4) && trim($regra->pivot->parametro4) !== '') ? $regra->pivot->parametro4 : '1';
                $expressao = str_ireplace('params[3]', $p4, $expressao);
            }

            // Remove any remaining unreplaced params, default to 1
            $expressao = preg_replace('/params\[\d+\]/i', '1', $expressao);

            $expressao = preg_replace("/\bdraw\b/i", $isDraw ? '1' : '0', $expressao);

            // Substituições que valem para a equipe (Dupla/Trio) como um todo
            $expressao = str_ireplace('maximo_inscricao_dupla', $qtdConjunto + 1, $expressao);
            $expressao = str_ireplace('maximo_inscricao_trio', $qtdConjunto + 1, $expressao);

            \Log::info("Regra: {$regra->nome}, isDraw: " . ($isDraw ? 'true' : 'false') . ", expressao: $expressao");

            if ($regra->regra_aplicante == 3) {
                // Soma da dupla
                if (preg_match('/\bidade\b/i', $expressao) && (count($usuarios) < 2 || $usuarios[0]['idade'] === 'null' || (isset($usuarios[1]) && $usuarios[1]['idade'] === 'null'))) {
                    throw new \Exception("A regra exige restrição de idade (soma), mas há competidores sem data de nascimento cadastrada.");
                }

                $exp = preg_replace('/\bidade\b/i', $somaIdades, $expressao);
                $exp = preg_replace('/\bhandicap\b/i', $somaHandicap, $exp);
                if (!$this->evaluaExpressaoSimples($exp)) {
                    throw new \Exception("Regra não atendida pela soma da dupla: {$regra->nome}");
                }
            } else {
                $atendeuCount = 0;
                foreach ($usuarios as $u) {
                    if (preg_match('/\bidade_cavalo\b/i', $expressao) && $u['idade_cavalo'] === 'null') {
                        throw new \Exception("A regra exige restrição de idade do cavalo, mas o cavalo utilizado não possui data de nascimento cadastrada.");
                    }

                    if (preg_match('/\bidade\b/i', $expressao) && $u['idade'] === 'null') {
                        throw new \Exception("A regra exige restrição de idade, mas o competidor {$u['usuario']->nome} não possui data de nascimento cadastrada.");
                    }

                    $exp = preg_replace('/\bidade_cavalo\b/i', $u['idade_cavalo'], $expressao);
                    $exp = preg_replace('/\bidade\b/i', $u['idade'], $exp);
                    $exp = preg_replace('/\bhandicap\b/i', $u['handicap'], $exp);
                    $exp = preg_replace('/\bpotro_futuro\b/i', $u['potro_futuro'], $exp);
                    
                    // Substituições para limites baseados no competidor/cavalo atual
                    $idC = $u['usuario']->id_usuario;
                    $qtdDrawsAtual = $isDraw ? ($countsPorCompetidor[$idC]['draws'] + 1) : 0;

                    $exp = str_ireplace('maximo_inscricao_competidor', $countsPorCompetidor[$idC]['inscricoes'] + 1, $exp);
                    $exp = str_ireplace('maximo_draws', $qtdDrawsAtual, $exp);
                    $exp = str_ireplace('maximo_inscricao_cavalo', $countsPorCompetidor[$idC]['cavalo'] + 1, $exp);

                    // Sexo: substitui sexo == 'F' por verdadeiro/falso avaliado
                    // Como não temos parser complexo ainda, vamos fazer um replace simples
                    if ($u['sexo'] == 'F' || $u['sexo'] == 'FEMININO') {
                        $exp = preg_replace("/sexo\s*==\s*['\"]F['\"]/i", '1 == 1', $exp);
                        $exp = preg_replace("/sexo\s*!=\s*['\"]M['\"]/i", '1 == 1', $exp);
                    } else if ($u['sexo'] == 'M' || $u['sexo'] == 'MASCULINO') {
                        $exp = preg_replace("/sexo\s*==\s*['\"]M['\"]/i", '1 == 1', $exp);
                        $exp = preg_replace("/sexo\s*!=\s*['\"]F['\"]/i", '1 == 1', $exp);
                    }
                    // Limpa sexo que não match para falso
                    $exp = preg_replace("/sexo\s*(==|!=)\s*['\"][FM]['\"]/i", '1 == 0', $exp);
                    // 'E' e 'OU' portugues
                    $exp = str_ireplace(' E ', ' and ', $exp);
                    $exp = str_ireplace(' OU ', ' or ', $exp);

                    if ($this->evaluaExpressaoSimples($exp)) {
                        $atendeuCount++;
                    }
                }

                if ($regra->regra_aplicante == 1 && $atendeuCount < count($usuarios)) {
                    throw new \Exception("Ambos os competidores devem atender à regra: {$regra->nome}");
                }
                if ($regra->regra_aplicante == 2 && $atendeuCount == 0) {
                    throw new \Exception("Ao menos um competidor deve atender à regra: {$regra->nome}");
                }
            }
        }
        
        return true;
    }

    /**
     * Usa o ExpressionLanguage do Symfony.
     */
    private function evaluaExpressaoSimples($expressao)
    {
        try {
            $language = new \Symfony\Component\ExpressionLanguage\ExpressionLanguage();
            // Convert E -> and, OU -> or
            $expressao = str_ireplace(' E ', ' and ', $expressao);
            $expressao = str_ireplace(' OU ', ' or ', $expressao);
            return (bool) $language->evaluate($expressao);
        } catch (\Exception $e) {
            \Log::error("Erro ao avaliar regra: $expressao - " . $e->getMessage());
            return false;
        }
    }
}
