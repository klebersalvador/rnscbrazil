const fs = require('fs');

exports.salvaImagem = (oldPath, newPath, fileName) =>{
    fs.exists(newPath, exists => {
        if(!exists){
            fs.mkdir(newPath, {recursive: true}, (err) => {
                if (err){
                    console.log(err);
                    throw new Error('Falha ao criar arquivo de imagem');
                }
            });
        }
        fs.rename(oldPath, newPath + fileName, err => {
            if(err){
                console.log(err);
                throw new Error('Falha ao renomear arquivo de imagem');
            }
        });
    });

}

exports.excluiImagem = (path, fileName) =>{
    let file = path + fileName;
    fs.exists(file, exists => {
        if(!exists){
            return;
        }
        fs.unlinkSync(file);
    });
}

exports.copiarImagem = (path, oldFileName, newFileName) => {
    let file = path + oldFileName;
    let newFile = path + newFileName;
    fs.exists(file, exists => {
        if(!exists){
            return;
        }
        fs.copyFileSync(file, newFile)
    });
}