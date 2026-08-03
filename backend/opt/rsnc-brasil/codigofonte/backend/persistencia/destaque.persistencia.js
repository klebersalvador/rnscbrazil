const pgp = require('pg-promise')
const Util = require('../util/util')

class DestaqueDao{

    constructor(connection){
        this._connection = connection;
    }

    inserir(destaque){
        let sql = " INSERT INTO destaque(    " +
                  " titulo,                  " +
                  " texto,                   " +
                  " endereco,                " +
                  " tipo_destaque,           " +
                  " ativo,                   " +
                  " data_cadastramento)      " +
                  " VALUES($1,$2,$3,$4,$5,now()) " +
                  " RETURNING *              ";

        let values = [
            destaque.titulo,
            destaque.texto,
            destaque.endereco,
            destaque.tipo_destaque,
            destaque.ativo
        ];

        return new Promise((resolve, reject) => {
            this._connection.query(sql, values, (err, res) => {
                if (err) return reject(err);
                resolve(res.rows[0]);
            })
        });
    }

    buscaPorId(id_destaque){
        let sql = " SELECT id_destaque,    " +
                  " titulo,                " +
                  " texto,                 " +
                  " endereco,              " +
                  " tipo_destaque,         " +
                  " data_cadastramento,    " +
                  " data_modificacao       " +
                  " FROM destaque          " +
                  " WHERE id_destaque = $1 " +
                  " AND ativo = true       ";

        let values = [id_destaque];

        return new Promise((resolve, reject) => {
            this._connection.query(sql, values, (err, res) => {
                if (err) return reject(err);
                resolve(res.rows[0]);
            })
        });

    }

    buscaTodos(){
        let sql = " SELECT id_destaque,     " +
                  " titulo,                 " +
                  " texto,                  " +
                  " endereco,               " +
                  " tipo_destaque,          " +
                  " data_cadastramento,     " +
                  " data_modificacao,       " +
                  " ativo                   " +
                  " FROM destaque           " +
                  " WHERE ativo = true      " +
                  " ORDER BY tipo_destaque, " +
                  " id_destaque             ";

        let values = [];
        
        return new Promise((resolve, reject) => {
            this._connection.query(sql, values, (err, res) => {
                if (err) return reject(err);
                resolve(res.rows);
            })
        });

    }

    alterar(id_destaque, destaque){
        let sql = " UPDATE destaque set      " +
                  " titulo = $2,             " +
                  " texto = $3,              " +
                  " endereco = $4,           " +
                  " tipo_destaque = $5,      " +
                  " ativo = $6,              " +
                  " data_modificacao = now() " +
                  " where id_destaque = $1   " +
                  " RETURNING *              ";

        let values = [
            id_destaque,
            destaque.titulo,
            destaque.texto,
            destaque.endereco,
            destaque.tipo_destaque,
            destaque.ativo
        ];

        return new Promise((resolve, reject) => {
            this._connection.query(sql, values, (err, res) => {
                if (err) return reject(err);
                resolve(res.rows[0]);
            })
        });
    }

    delete(id_destaque){
        let sql = " UPDATE destaque SET    " +
                  " ativo = false          " +
                  " WHERE id_destaque = $1 ";

        let values = [id_destaque];

        return new Promise((resolve, reject) => {
            this._connection.query(sql, values, (err, res) => {
                if (err) return reject(err);
                resolve(res.rows[0]);
            })
        });
    }

    buscaFiltro(filtro){
        let sql = " SELECT id_destaque,     " +
                  " titulo,                 " +
                  " texto,                  " +
                  " endereco,               " +
                  " tipo_destaque,          " +
                  " data_cadastramento,     " +
                  " data_modificacao,       " +
                  " ativo                   " +
                  " FROM destaque           " +
                  " WHERE 1 = 1             ";

        let values = [];
        let i = 1;
        if(filtro){
            if(filtro.titulo && filtro.titulo != ""){
                sql += ` AND titulo ILIKE $${i++}`;
                values.push(`%${filtro.titulo}%`);
            }

            if(filtro.status != null && filtro.status != undefined){
                sql += ` AND ativo = $${i++}`;
                values.push(`${filtro.status}`);
            }

            if(filtro.tipoArquivo){
                sql += ` AND tipo_destaque = $${i++}`;
                values.push(`${filtro.tipoArquivo}`);
            }
        }

        sql +=  " ORDER BY tipo_destaque, titulo ";

        if(filtro){
            if(filtro.limit){
                sql += ` LIMIT $${i++}`;
                values.push(filtro.limit);
            }

            if(filtro.offset){
                sql += ` OFFSET $${i++}`;
                values.push(filtro.offset);
            }
        }

        return new Promise((resolve, reject) => {
            this._connection.query(sql, values, (err, res) => {
                if (err) return reject(err);
                resolve(res.rows);
            })
        });
    }

    buscaQuantidadeFiltro(filtro){
        let sql = " SELECT COUNT(DISTINCT(id_destaque)) as quantidade " +
                  " FROM destaque " +
                  " WHERE 1 = 1   ";

        let values = [];
        let i = 1;
        if(filtro){
            if(filtro.titulo && filtro.titulo != ""){
                sql += ` AND titulo ILIKE $${i++}`;
                values.push(`%${filtro.titulo}%`);
            }

            if(filtro.status != null && filtro.status != undefined){
                sql += ` AND ativo = $${i++}`;
                values.push(`${filtro.status}`);
            }

            if(filtro.tipoArquivo){
                sql += ` AND tipo_destaque = $${i++}`;
                values.push(`${filtro.tipoArquivo}`);
            }
        }

        return new Promise((resolve, reject) => {
            this._connection.query(sql, values, (err, res) => {
                if (err) return reject(err);
                resolve(res.rows[0].quantidade);
            })
        });
    }

    atulizarStatus(id_destaque, status){
        let sql = " UPDATE destaque SET      " +
                  " ativo = $2,              " +
                  " data_modificacao = now() " +
                  " where id_destaque = $1   " +
                  " RETURNING *              ";

        let values = [
            id_destaque,
            status
        ];

        return new Promise((resolve, reject) => {
            this._connection.query(sql, values, (err, res) => {
                if (err) return reject(err);
                resolve(res.rows[0]);
            })
        });
    }
}

module.exports = DestaqueDao;