"use strict";

const express = require('express')
,bodyParser = require('body-parser')
,path = require('path')
 ,rotas = require('../rotas/rotas')
 ,pool = require('./pool-factory')
 ,cors = require('cors')
,multiparty = require('connect-multiparty')
,connectionMiddleware = require('./connection-middleware')
,helmet = require('helmet');
const { stream } = require('../logger');
const morganBody = require('morgan-body');
const fs = require('fs');

const app = express();

var data = new Date();
var dia = String(data.getDate()).padStart(2, '0');
var mes = String(data.getMonth() + 1).padStart(2, '0');
var ano = data.getFullYear();
var dataAtual = dia + '.' + mes + '.' + ano;
//const log = fs.createWriteStream(
  // path.join(__dirname, "./logs", `logsis.log`), { flags: "a" } 
  //path.join(__dirname, "../../../../logs", `dia`+dataAtual+`.txt`), { flags: "a" }
  // path.join(__dirname, "../../../../logs", `dia`+dataAtual+`.log`), { flags: "a" }

//);

//morganBody(app, {
  //noColors: true,
  //stream: log,
//})

app.use(helmet({
  frameguard: {action: 'deny'}
}))
app.use(cors());
app.use(connectionMiddleware(pool));
app.use(bodyParser.json({limit: '50mb', extended: true}));
app.use(bodyParser.urlencoded({limit: '50mb', extended: true }));
app.use('/',express.static(path.join(__dirname, '../front')));
app.use('/api',rotas);


const httpServer = require('http').createServer(app);

module.exports.server = httpServer;