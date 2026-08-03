const ProvaRacasRepository = require('../persistencia/prova.racas.persistencia');
const ProvaRepository = require('../persistencia/prova.persistencia');
const RacaRepository = require('../persistencia/raca.persistencia');
const EventoRepository = require('../persistencia/evento.persistencia');
const DivisaoRepository = require('../persistencia/divisao.persistencia');
const CampeonatoRepository = require('../persistencia/campeonato.persistencia');
const UsuarioRepository = require('../persistencia/usuario.persistencia');
const PerfilRepository = require('../persistencia/perfi.persistencia');
const TipoInscricaoRepository = require('../persistencia/tipo-inscricao.persistencia');
const PerguntaHandicapRepository = require('../persistencia/pergunta-handicap.persistencia');
const RespostaHandicapRepository = require('../persistencia/resposta-handicap.persistencia');

class DtoHelper {

      constructor(connection) {
            this._connection = connection;
            this.provaRacasRepository = new ProvaRacasRepository(this._connection);
            this.provaRepository = new ProvaRepository(this._connection);
            this.racaRepository = new RacaRepository(this._connection);
            this.eventoRepository = new EventoRepository(this._connection);
            this.divisaoRepository = new DivisaoRepository(this._connection);
            this.campeonatoRepository = new CampeonatoRepository(this._connection);
            this.usuarioRepository = new UsuarioRepository(this._connection);
            this.perfilRepository = new PerfilRepository(this._connection);
            this.tipoInscricaoRepository = new TipoInscricaoRepository(this._connection);
            this.perguntaHandicapRepository= new PerguntaHandicapRepository(this._connection);
            this.respostaHandicapRepository= new RespostaHandicapRepository(this._connection);
      }

      async toProvaRacasDTO(provaRacas) {
            return {
                  id_prova_racas: provaRacas.id_prova_racas,
                  acrescimo_premiacao: provaRacas.acrescimo_premiacao,
                  porcentagem_premiacao: provaRacas.porcentagem_premiacao,
                  correr_separado: provaRacas.correr_separado,
                  valor_adicional_inscricao: provaRacas.valor_adicional_inscricao,
                  id_prova: provaRacas.id_prova,
                  id_evento: provaRacas.id_evento,
                  id_divisao: provaRacas.id_divisao,
                  id_raca: provaRacas.id_raca,
                  prova: provaRacas.id_prova ? await this.toProvaDTO(await this.provaRepository.getById(provaRacas.id_prova)) : undefined,
                  evento: provaRacas.id_evento ? await this.toEventoDTO(await this.eventoRepository.getById(provaRacas.id_evento)) : undefined,
                  divisao: await this.toDivisaoDTO(await this.divisaoRepository.getById(provaRacas.id_divisao)),
                  raca: await this.toRacaDTO(await this.racaRepository.getById(provaRacas.id_raca)),
                  nao_pontuar_profissional: provaRacas.nao_pontuar_profissional,
                  correr_tempo_base: provaRacas.correr_tempo_base
            }
      }
      
      async toRacaDTO(raca) {
            return {
                  id_raca: raca.id_raca,
                  abreviacao: raca.abreviacao,
                  descricao: raca.descricao,
                  data_criacao: raca.data_criacao,
                  data_modificacao: raca.data_modificacao
            }
      }

      async toProvaDTO(prova) {
            return {
                  id_prova: prova.id_prova,
                  prova_finalizada: prova.prova_finalizada,
                  tipo_prova: prova.tipo_prova,
                  id_evento: prova.id_evento,
                  id_divisao: prova.id_divisao,
                  evento: await this.toEventoDTO(await this.eventoRepository.getById(prova.id_evento)),
                  divisao: await this.toDivisaoDTO(await this.divisaoRepository.getById(prova.id_divisao)),
                  iniciada: prova.iniciada,
                  descricao: prova.descricao,
                  handicap_minimo_prova: prova.handicap_minimo_prova,
                  numero_maximo_inscricao_competidor: prova.numero_maximo_inscricao_competidor,
                  qtd_maxima_inscricao_dupla: prova.qtd_maxima_inscricao_dupla,
                  qtd_maxima_competidor: prova.qtd_maxima_competidor,
                  qtd_maxima_inscricao_cavalo: prova.qtd_maxima_inscricao_cavalo,
                  draw: prova.draw,
                  preco_inscricao: prova.preco_inscricao,
                  inscricao_bloqueada: prova.inscricao_bloqueada,
                  porcentagem_premiacao: prova.porcentagem_premiacao,
                  somatorio_minimo: prova.somatorio_minimo,
                  somatorio_maximo: prova.somatorio_maximo,
                  taxa_administrativa: prova.taxa_administrativa,
                  qtd_maxima_inscricao_trio : prova.qtd_maxima_inscricao_trio,
                  racasPontuar: prova.id_prova ? await this.provaRacasRepository.buscaRacasPontuarProva(prova.id_prova) : undefined
            }
      }

      async toDivisaoDTO(divisao) {
            return {
                  id_divisao: divisao.id_divisao,
                  nome: divisao.nome,
                  ativo: divisao.ativo,
                  nao_pontuar: divisao.nao_pontuar,
                  nao_premiar: divisao.nao_premiar,
                  nao_exigir_cadastro: divisao.nao_exigir_cadastro,
                  tempo_divisao: divisao.tempo_divisao,
                  rebatedor_apartador: divisao.rebatedor_apartador,
                  id_raca: divisao.id_raca,
                  raca: divisao.id_raca ? await this.toRacaDTO(await this.racaRepository.getById(divisao.id_raca)) : undefined,
                  is_todos_contra_todos: divisao.is_todos_contra_todos,
                  id_tipo_inscricao: divisao.id_tipo_inscricao,
                  tipo_inscricao: await this.toTipoInscricaoDTO(await this.tipoInscricaoRepository.getById(divisao.id_tipo_inscricao)),
                  somatorio_minimo: divisao.somatorio_minimo,
                  somatorio_maximo: divisao.somatorio_maximo,
                  potro_futuro: divisao.potro_futuro
            }
      }

      async toTipoInscricaoDTO(tipoInscricao) {
            return {
                  id_tipo_inscricao: tipoInscricao.id_tipo_inscricao,
                  nome: tipoInscricao.nome
            }
      }

      async toEventoDTO(evento) {
            return {
                  id_evento: evento.id_evento,
                  titulo: evento.titulo,
                  descricao: evento.descricao,
                  id_organizador: evento.id_organizador,
                  organizador: await this.toUsuarioDTO(await this.usuarioRepository.getById(evento.id_organizador)),
                  website: evento.website,
                  localizacao: evento.localizacao,
                  imagem_exibicao: evento.imagem_exibicao,
                  data_inicial: evento.data_inicial,
                  data_final: evento.data_final,
                  data_inicio_inscricoes: evento.data_inicio_inscricoes,
                  data_fim_inscricoes: evento.data_fim_inscricoes,
                  id_campeonato: evento.id_campeonato,
                  campeonato: evento.id_campeonato ? await this.toCampeonatoDTO(await this.campeonatoRepository.getById(evento.id_campeonato)) : undefined,
                  telefone: evento.telefone,
                  maximo_inscricoes_competidor: evento.maximo_inscricoes_competidor,
                  maximo_inscricoes_duplas: evento.maximo_inscricoes_duplas,
                  maximo_inscricoes_trio: evento.maximo_inscricoes_trio,
                  maximo_inscricoes_cavalo: evento.maximo_inscricoes_cavalo,
                  porcentagem_premiacao: evento.porcentagem_premiacao,
                  porcentagem_premiacao_todos_contra_todos: evento.porcentagem_premiacao_todos_contra_todos,
                  incremento_premiacao_todos_contra_todos: evento.incremento_premiacao_todos_contra_todos,
                  maximo_inscricoes_todos_contra_todos: evento.maximo_inscricoes_todos_contra_todos,
                  preco_inscricao_todos_contra_todos: evento.preco_inscricao_todos_contra_todos,
                  quantidade_premiados_todos_contra_todos: evento.quantidade_premiados_todos_contra_todos,
                  tempo_passada_todos_contra_todos: evento.tempo_passada_todos_contra_todos,
                  maximo_competidores: evento.maximo_competidores,
                  maximo_inscricoes: evento.maximo_inscricoes,
                  localizacao_maps: evento.localizacao_maps,
                  taxa_administrativa: evento.taxa_administrativa,
                  provas: evento.id_evento ? await this.provaRepository.buscaProvasDeUmEvento(evento.id_evento) : undefined,
                  finalizado: evento.finalizado,
                  data_finalizacao: evento.data_finalizacao
            }
      }

      async toCampeonatoDTO(campeonato) {
            return {
                  id_campeonato: campeonato.id_campeonato,
                  ativo: campeonato.ativo,
                  id_organizador: campeonato.id_organizador,
                  organizador: await this.toUsuarioDTO(await this.usuarioRepository.getById(campeonato.id_organizador)),
                  campeonato_finalizado: campeonato.campeonato_finalizado,
                  data_inicial: campeonato.data_inicial,
                  data_final: campeonato.data_final,
                  nome: campeonato.nome,
                  descricao: campeonato.descricao,
                  porcentagem_premiacao: campeonato.porcentagem_premiacao,
                  preco_inscricao: campeonato.preco_inscricao,
                  imagem_exibicao: campeonato.imagem_exibicao,
                  maximo_inscricoes: campeonato.maximo_inscricoes
            }
      }

      async toUsuarioDTO(usuario) {
            return {
                  id_usuario: usuario.id_usuario,
                  nome: usuario.nome,
                  apelido: usuario.apelido,
                  data_nascimento: usuario.data_nascimento,
                  sexo: usuario.sexo,
                  cpf: usuario.cpf,
                  rg: usuario.rg,
                  email: usuario.email,
                  cep: usuario.cep,
                  estado: usuario.estado,
                  cidade: usuario.cidade,
                  bairro: usuario.bairro,
                  logradouro: usuario.logradouro,
                  numero: usuario.numero,
                  telefone: usuario.telefone,
                  competidor: usuario.competidor,
                  id_perfil: usuario.id_perfil,
                  perfil: await this.toPerfilDTO(await this.perfilRepository.getById(usuario.id_perfil)),
                  handicap: usuario.handicap,
                  login: usuario.login,
                  ativo: usuario.ativo,
                  excluido: usuario.excluido
            }
      }

      async toPerfilDTO(perfil) {
            return {
                  id_perfil: perfil.id_perfil,
                  nome: perfil.nome
            }
      }

      async toRespostaPerguntaDTO(respostaPergunta){
            return {
                  id_resposta_pergunta : respostaPergunta.id_resposta_pergunta,
                  id_usuario : respostaPergunta.id_usuario,
                  id_pergunta : respostaPergunta.id_pergunta,
                  id_resposta : respostaPergunta.id_resposta,
                  sem_cadastro : respostaPergunta.sem_cadastro,
                  pergunta : await this.perguntaHandicapRepository.buscaPorId(respostaPergunta.id_pergunta),
                  resposta : await this.respostaHandicapRepository.buscaPorId(respostaPergunta.id_resposta)
            }
      }

      async toCavaloDTO(cavalo){
            return{
                  id_cavalo: cavalo.id_cavalo,
                  ativo: cavalo.ativo,
                  nascimento: cavalo.nascimento,
                  nome: cavalo.nome,
                  id_proprietario: cavalo.id_proprietario ? cavalo.id_proprietario : null,
                  proprietario: cavalo.id_proprietario == null ? cavalo.id_proprietario : 
                                await this.usuarioRepository.buscaPorId(cavalo.id_proprietario),
                  registro: cavalo.registro,
                  rsnc: cavalo.rsnc,
                  site: cavalo.site,
                  raca: cavalo.raca,
                  sexo_animal: cavalo.sexo_animal,
                  cidade: cavalo.cidade,
                  unidade_federativa: cavalo.uf,
                  id_raca : cavalo.id_raca,
                  nome_proprietario : cavalo.nome_proprietario,
                  id_unidade_federativa: cavalo.id_unidade_federativa
            }
      }

      async toDestaqueDTO(destaque){
            return {
                  id_destaque : destaque.id_destaque,
                  titulo : destaque.titulo,
                  texto : destaque.texto,
                  endereco : destaque.endereco,
                  tipo_destaque : destaque.tipo_destaque,
                  data_cadastramento : destaque.data_cadastramento,
                  data_modificacao : destaque.data_modificacao,
                  ativo : destaque.ativo
            }
      }

      async toNoticiaDTO(noticia){
            return {
                  id_noticia: noticia.id_noticia,
                  titulo: noticia.titulo,
                  texto: noticia.texto,
                  id_autor: noticia.id_autor,
                  id_tipo_noticia: noticia.id_tipo_noticia,
                  id_referencia_noticia: noticia.id_referencia_noticia,
                  imagem_exibicao: noticia.imagem_exibicao,
                  data_criacao: noticia.data_criacao,
                  ativa: noticia.ativa,
                  id_tipo_arquivo : noticia.id_tipo_arquivo
            }
      }

      async toRegraAssociacaoDTO(regraAssociacao){
            return {
                  id_regra_associacao: regraAssociacao.id_regra_associacao,
                  nome: regraAssociacao.nome,
                  descricao: regraAssociacao.descricao,
                  regra: regraAssociacao.regra,
                  expressao: regraAssociacao.expressao,
                  parametros: regraAssociacao.parametros
            }
      }

      async toRegraDivisaoDTO(regraDivisao){
            return {
                  id_regra_divisao: regraDivisao.id_regra_divisao,
                  descricao: regraDivisao.descricao,
                  id_divisao: regraDivisao.id_divisao, 
                  expressao: regraDivisao.expressao,
                  parametros: regraDivisao.parametros,
                  numero_competidor : regraDivisao.numero_competidor,
                  regra_aplicante : regraDivisao.regra_aplicante
            }
      }

      async toRegraEventoDTO(regraEvento){
            return {
                  id_regra_evento: regraEvento.id_regra_evento,
                  descricao: regraEvento.descricao,
                  expressao: regraEvento.expressao,
                  parametros: regraEvento.parametros,
                  id_evento: regraEvento.id_evento
            }
      }

      async toUsuarioSemCadastro(usuario){
            return {
                  id_usuario : usuario.id_usuario,
                  nome : usuario.nome,
                  apelido : usuario.apelido,
                  data_nascimento : usuario.data_nascimento,
                  sexo : usuario.sexo,
                  telefone : usuario.telefone,
                  competidor : usuario.competidor,
                  handicap : usuario.handicap,
                  ativo : usuario.ativo,
                  excluido : usuario.excluido,
                  pendente : usuario.pendente,
                  semCadastro : true
            }
      }

}
module.exports = DtoHelper;