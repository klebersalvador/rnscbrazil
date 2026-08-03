const Transacoes = require('../persistencia/transacoes/transacoes');
const DtoHelper = require('../helpers/dto.helper');
const ProvaRacasRepository = require('../persistencia/prova.racas.persistencia');
const ProvaRacas = require('../modelos/modelo.prova-racas');
const Valida = require('../util/valida');

class ProvaRacasService {

      constructor(connection) {
            this._connection = connection;
            this.transactions = new Transacoes(this._connection);
            this.provaRacasRepository = new ProvaRacasRepository(this._connection);
            this.dtoHelper = new DtoHelper(this._connection);
      }

      async buscaRacasPontuarPorEventoDivisao(idEvento, idDivisao) {
            try {
                  const provasRacas = await this.provaRacasRepository.buscaRacasPontuarPorEventoDivisao(idEvento, idDivisao);
                  const provasRacasDTO = provasRacas.map(async provaRacas => await this.dtoHelper.toProvaRacasDTO(provaRacas));
                  return Promise.all(provasRacasDTO);
            } catch (e) {
                  throw e;
            }
      }

      async get() {
            try {
                  const provasRacas = await this.provaRacasRepository.get();
                  const provasRacasDTO = provasRacas.map(async provaRacas => await this.dtoHelper.toProvaRacasDTO(provaRacas));
                  return Promise.all(provasRacasDTO);
            } catch (e) {
                  throw e;
            }
      }

      async getById(id) {
            try {
                  const provaRacas = await this.provaRacasRepository.getById(id);
                  if (provaRacas) {
                        const provaRacasDTO = await this.dtoHelper.toProvaRacasDTO(provaRacas);
                        return provaRacasDTO;
                  } else {
                        return undefined;
                  }
            } catch (e) {
                  throw e;
            }
      }

      async post(req) {
            const body = req.body;
            try {
                  await this.transactions.begin();
                  var provaRacasDTO = null;
                  const provaRacasEntity = new ProvaRacas(body);
                  let valida = new Valida();
                  let validacao = valida.validaProvaRaca(provaRacasEntity);

                  if(validacao.status){
                        const provaRacas = await this.provaRacasRepository.post(provaRacasEntity);
                        provaRacasDTO = await this.dtoHelper.toProvaRacasDTO(provaRacas);
                        await this.transactions.commit();
                  }else{
                        throw validacao.mensagem;
                  }

                  return provaRacasDTO;
            } catch (e) {
                  await this.transactions.rollback();
                  throw e;
            }
      }

      async put(id, req) {
            const body = req.body;
            try {
                  await this.transactions.begin();
                  const provaRacasEntity = new ProvaRacas(body);
                  const provaRacas = await this.provaRacasRepository.put(id, provaRacasEntity);
                  const provaRacasDTO = await this.dtoHelper.toProvaRacasDTO(provaRacas);
                  await this.transactions.commit();
                  return provaRacasDTO;
            } catch (e) {
                  await this.transactions.rollback();
                  throw e;
            }
      }

      async delete(id) {
            try {
                  await this.transactions.begin();
                  const provaRacas = await this.provaRacasRepository.delete(id);
                  const provaRacasDTO = await this.dtoHelper.toProvaRacasDTO(provaRacas);
                  await this.transactions.commit();
                  return provaRacasDTO;
            } catch (e) {
                  await this.transactions.rollback();
                  throw e;
            }
      }

}
module.exports = ProvaRacasService;