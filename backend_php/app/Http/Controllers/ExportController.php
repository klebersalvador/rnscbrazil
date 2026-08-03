<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Prova;
use App\Models\Inscricao;
use Illuminate\Support\Facades\Response;

class ExportController extends Controller
{
    /**
     * Gera um arquivo XML genérico contendo os resultados da prova.
     */
    public function exportarXML($id_prova)
    {
        $prova = Prova::with(['evento', 'divisao'])->findOrFail($id_prova);
        
        $inscricoes = Inscricao::with(['competidores.competidor', 'competidores.cavalo'])
            ->where('id_prova', $id_prova)
            ->where('excluido', 0)
            ->whereNotNull('classificacao')
            ->orderBy('classificacao', 'asc')
            ->get();

        // Criar estrutura XML
        $xml = new \SimpleXMLElement('<?xml version="1.0" encoding="UTF-8"?><ResultadosProva/>');
        
        // Dados da Prova
        $meta = $xml->addChild('Metadados');
        $meta->addChild('Evento', htmlspecialchars($prova->evento->titulo ?? ''));
        $meta->addChild('Divisao', htmlspecialchars($prova->divisao->nome ?? ''));
        $meta->addChild('Data', $prova->data_criacao);

        $lista = $xml->addChild('Classificacao');

        foreach ($inscricoes as $insc) {
            $item = $lista->addChild('Inscricao');
            $item->addChild('Posicao', $insc->classificacao);
            $item->addChild('Tempo', $insc->tempo ?? '0.000');
            $item->addChild('Bois', $insc->bois ?? '0');
            $item->addChild('SAT', $insc->sat ? '1' : '0');

            $dupla = $item->addChild('Competidores');
            foreach ($insc->competidores as $comp) {
                $c = $dupla->addChild('Competidor');
                $c->addChild('Nome', htmlspecialchars($comp->competidor->nome ?? 'Desconhecido'));
                $c->addChild('Cavalo', htmlspecialchars($comp->cavalo->nome ?? 'Desconhecido'));
            }
        }

        $xmlString = $xml->asXML();

        // Retornar como arquivo de download
        $nomeArquivo = 'resultado_prova_' . $id_prova . '.xml';
        
        return Response::make($xmlString, 200, [
            'Content-Type' => 'application/xml',
            'Content-Disposition' => 'attachment; filename="' . $nomeArquivo . '"'
        ]);
    }
}
