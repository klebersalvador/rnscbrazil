const fs = require('fs');
const config = require('../config/config');
const imageThumbnail = require('image-thumbnail');

exports.buscaImagemTreinador = async (req, res) => {
    try {
        let path = config.UPLOAD_DIR_BASE + config.UPLOAD_DIR_FOTO_TREINADOR;
        const imgPath = path + req.params.path;
        if(imgPath){
            let img = fs.readFileSync(imgPath);
            res.writeHead(200, {'Content-Type': 'image/gif' });
            res.end(img, 'binary');
        }
    } catch (e) {
        return res.status(400).json({
            titulo: 'Erro',
            mensagem: e
        });
    }
}

exports.buscaImagemEvento = async (req, res) => {
    try {
        let path = config.UPLOAD_DIR_BASE + config.UPLOAD_DIR_FOTO_EVENTO;
        const imgPath = path + req.params.path;
        if(imgPath){
            let img = fs.readFileSync(imgPath);
            res.writeHead(200, {'Content-Type': 'image/gif' });
            res.end(img, 'binary');
        }
    } catch (e) {
        return res.status(400).json({
            titulo: 'Erro',
            mensagem: e
        });
    }
}

exports.buscaImagemCampeonato = async (req, res) => {
    try {
        let path = config.UPLOAD_DIR_BASE + config.UPLOAD_DIR_FOTO_CAMPEONATO;
        const imgPath = path + req.params.path;
        if (imgPath) {
            let img = fs.readFileSync(imgPath);
            res.writeHead(200, {'Content-Type': 'image/gif'});
            res.end(img, 'binary');
        }
    } catch (e) {
        return res.status(400).json({
            titulo: 'Erro',
            mensagem: e
        })
    }
}

exports.buscaImagemNoticia = async (req, res) => {
    try {
        let path = config.UPLOAD_DIR_BASE + config.UPLOAD_DIR_FOTO_NOTICIA;
        const imgPath = path + req.params.path;
        if (imgPath) {
            let img = fs.readFileSync(imgPath);
            res.writeHead(200, {'Content-Type': 'image/gif'});
            res.end(img, 'binary');
        }
    } catch (e) {
        return res.status(400).json({
            titulo: 'Erro',
            mensagem: e
        })
    }
}

exports.buscaThumbnailTreinador = async (req, res) => {
    try {
        let path = config.UPLOAD_DIR_BASE + config.UPLOAD_DIR_FOTO_TREINADOR;
        const imgPath = path + req.params.path;
        if(imgPath){
            let imgBuffer = fs.readFileSync(imgPath);
            let options = { width: 150, height: 150 };
            let thumbnail = await imageThumbnail(imgBuffer, options);
            res.writeHead(200, {'Content-Type': 'image/gif' });
            res.end(thumbnail, 'binary');
        }
    } catch (e) {
        return res.status(400).json({
            titulo: 'Erro',
            mensagem: e
        });
    }
}

exports.buscaThumbnailEvento = async (req, res) => {
    try {
        let path = config.UPLOAD_DIR_BASE + config.UPLOAD_DIR_FOTO_EVENTO;
        const imgPath = path + req.params.path;
        if(imgPath){
            let imgBuffer = fs.readFileSync(imgPath);
            let options = { width: 100, height: 100 };
            let thumbnail = await imageThumbnail(imgBuffer, options);
            res.writeHead(200, {'Content-Type': 'image/gif' });
            res.end(thumbnail, 'binary');
        }
    } catch (e) {
        return res.status(400).json({
            titulo: 'Erro',
            mensagem: e
        });
    }
}

exports.buscaThumbnailCampeonato = async (req, res) => {
    try {
        let path = config.UPLOAD_DIR_BASE + config.UPLOAD_DIR_FOTO_CAMPEONATO;
        const imgPath = path + req.params.path;
        if (imgPath) {
            let imgBuffer = fs.readFileSync(imgPath);
            let options = { width: 100, heigth: 100 };
            let thumbnail = await imageThumbnail(imgBuffer, options);
            res.writeHead(200, {'Content-Type': 'imagem/gif'});
            res.end(thumbnail, 'binary');
        }
    } catch (e) {
        return res.status(400).json({
            titulo: 'Erro',
            mensagem: e
        })
    }
}

exports.buscaThumbnailNoticia = async (req, res) => {
    try {
        let path = config.UPLOAD_DIR_BASE + config.UPLOAD_DIR_FOTO_NOTICIA;
        const imgPath = path + req.params.path;
        if (imgPath) {
            let imgBuffer = fs.readFileSync(imgPath);
            let options = { width: 100, heigth: 100 };
            let thumbnail = await imageThumbnail(imgBuffer, options);
            res.writeHead(200, {'Content-Type': 'imagem/gif'});
            res.end(thumbnail, 'binary');
        }
    } catch (e) {
        return res.status(400).json({
            titulo: 'Erro',
            mensagem: e
        })
    }
}

exports.buscaImagem = async (req, res) => {
    try {
        let path = config.UPLOAD_DIR_BASE;
        
        const imgPath = path + req.params.path;
        if (imgPath) {
            let img = fs.readFileSync(imgPath);
            res.writeHead(200, {'Content-Type': 'image/gif'});
            res.end(img, 'binary');
        }
    } catch (e) {
        return res.status(400).json({
            titulo: 'Erro',
            mensagem: e
        })
    }
}

exports.buscaThumbnail = async (req, res) => {
    try {
        let path = config.UPLOAD_DIR_BASE;
        const imgPath = path + req.params.path;
        if(imgPath){
            let imgBuffer = fs.readFileSync(imgPath);
            let options = { width: 150, height: 150 };
            let thumbnail = await imageThumbnail(imgBuffer, options);
            res.writeHead(200, {'Content-Type': 'image/gif' });
            res.end(thumbnail, 'binary');
        }
    } catch (e) {
        return res.status(400).json({
            titulo: 'Erro',
            mensagem: e
        });
    }
}

exports.uploadImagem = async (req, res) => {
    try {
        let temp = req.files.files[0].path;
        if(temp){
            let imgBuffer = fs.readFileSync(temp);
            let options = { width: 100, height: 100, responseType: 'base64' };
            let thumbnail = 'data:image/gif;base64,' + await imageThumbnail(imgBuffer, options);
            return res.status(200).json({
                path: temp,
                img: thumbnail
            })
        }else{
            throw new Error('Falha ao carregar arquivo de imagem');
        }
    } catch (e) {
        return res.status(400).json({
            titulo: 'Erro',
            mensagem: e
        })
    }
}

exports.uploadPDF = async (req, res) => {
    try {
        let temp = req.files.file.path;
        if(temp){
            let imgBuffer = fs.readFileSync(temp);
            let options = { width: 100, height: 100, responseType: 'base64' };
            return res.status(200).json({
                path: temp
            })
        }else{
            throw new Error('Falha ao carregar arquivo PDF');
        }
    } catch (e) {
        return res.status(400).json({
            titulo: 'Erro',
            mensagem: e
        })
    }
}

exports.buscaPdf = async (req, res) => {
    try {
        let path = config.UPLOAD_DIR_BASE;
        const pdfPath = path + req.params.path;
        if (pdfPath) {
            let img = fs.readFileSync(pdfPath);
            res.writeHead(200, {'Content-Type': 'application/pdf'});
            res.end(img, 'binary');
        }
    } catch (e) {
        return res.status(400).json({
            titulo: 'Erro',
            mensagem: e
        })
    }
}

exports.uploadImagens = async (req, res) => {
    try {
        let files = req.files.files;
        if(files){
            let retorno = await files.map( async file => {
                let imgBuffer = fs.readFileSync(file.path);
                let options = { width: 100, height: 100, responseType: 'base64' };
                let thumbnail = 'data:image/gif;base64,' + await imageThumbnail(imgBuffer, options);
                return {
                    path: file.path,
                    img: thumbnail
                }
            });
            return res.status(200).json(await Promise.all(retorno));
        }else{
            throw new Error('Falha ao carregar arquivo de imagem');
        }
    } catch (e) {
        return res.status(400).json({
            titulo: 'Erro',
            mensagem: e
        })
    }
}
