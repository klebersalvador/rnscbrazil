<?php

namespace App\Services;

use App\Models\Prova;
use App\Models\Evento;
use App\Models\Inscricao;
use App\Models\InscricaoCompetidor;
use Illuminate\Support\Facades\DB;

class InscricaoService
{
    protected $validaInscricaoService;

    public function __construct(ValidaInscricaoService $validaInscricaoService)
    {
        $this->validaInscricaoService = $validaInscricaoService;
    }

    /**
     * Equivalente ao insereVerificandoProva do Node.js
     */
    public function insereVerificandoProva($dadosInscricao, $competidores)
    {
        // 1. Busca Prova e Evento
        $prova = Prova::with('divisao.regras')->findOrFail($dadosInscricao['id_prova']);
        $evento = Evento::findOrFail($prova->id_evento);

        // 2. Validações Iniciais
        if ($evento->finalizado) {
            throw new \Exception('O evento já foi finalizado.');
        }

        if ($this->validaInscricaoService->validaPrazoInscricao($evento->data_fim_inscricoes)) {
            // Em produção: verificar se quem cadastra é organizador (pula prazo)
            throw new \Exception('Período de inscrição foi encerrado!');
        }

        if ($prova->prova_finalizada || $prova->inscricao_bloqueada) {
            throw new \Exception('Inscrições bloqueadas ou prova finalizada.');
        }

        // 3. Regras (Handicap, Draw, Potro Futuro, Regras Customizadas)
        $regrasDaDivisao = $prova->divisao->regras ?? collect([]);
        $permite = $this->validaInscricaoService->verificaRegras($competidores, $regrasDaDivisao, [], $prova, $dadosInscricao);
        
        if (!$permite) {
            throw new \Exception('Inscrição bloqueada por regras de divisão.');
        }

        // 4. Executa a Inscrição com Transação para garantir integridade
        return DB::transaction(function () use ($dadosInscricao, $competidores, $prova) {
            $inscricao = Inscricao::create([
                'data_inscricao' => now(),
                'id_prova' => $prova->id_prova,
                'id_cadastrador' => $dadosInscricao['id_cadastrador'],
                'excluido' => false,
                'draw' => $dadosInscricao['draw'] ?? false,
                'id_evento' => $prova->id_evento,
                'tipo_inscricao' => $dadosInscricao['tipo_inscricao'] ?? 1,
            ]);

            foreach ($competidores as $competidor) {
                InscricaoCompetidor::create([
                    'id_inscricao' => $inscricao->id_inscricao,
                    'id_competidor' => $competidor['id_competidor'],
                    'id_cavalo' => $competidor['id_cavalo'] ?? null,
                    'numero_competidor' => $competidor['numero_competidor'] ?? null,
                    'status' => true,
                ]);
            }

            return $inscricao;
        });
    }
}
