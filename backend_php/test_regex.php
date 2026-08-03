<?php
$copyHeaderBuffer = "COPY public.evento (id_evento, titulo, descricao, id_organizador, website, localizacao, imagem_exibicao, data_inicial, data_final, data_inicio_inscricoes, data_fim_inscricoes, id_campeonato, telefone, maximo_inscricoes_competidor, maximo_inscricoes_duplas, porcentagem_premiacao, preco_inscricao, porcentagem_premiacao_todos_contra_todos, incremento_premiacao_todos_contra_todos, maximo_inscricoes_todos_contra_todos, preco_inscricao_todos_contra_todos, quantidade_premiados_todos_contra_todos, tempo_passada_todos_contra_todos, maximo_inscricoes, localizacao_maps, taxa_administrativa, maximo_competidores, maximo_inscricoes_trio, maximo_inscricoes_cavalo, finalizado, data_finalizacao, incremento_preco, data_inicial_tz) FROM stdin;";

if (preg_match('/COPY public\.([a-zA-Z0-9_]+)\s*\((.*?)\)\s*FROM stdin;/i', $copyHeaderBuffer, $matches)) {
    echo "Matched table: {$matches[1]}\n";
} else {
    echo "Failed to match.\n";
}
