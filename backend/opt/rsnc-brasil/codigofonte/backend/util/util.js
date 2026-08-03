exports.comparaStrings = function (string1, string2) {
    return string1.toLowerCase() === string2.toLowerCase();
};

exports.removerAcentos = function (string) {
    if (!string) return '';
    return string.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
};

exports.dataEhoraParaData = (data, hora) => {
    try {
        arrayDiaMesAno = data.split("/");
        arrayHoraMinuto = hora.split(":");

        return new Date(arrayDiaMesAno[2],
            arrayDiaMesAno[1] - 1,
            arrayDiaMesAno[0],
            arrayHoraMinuto[0],
            arrayHoraMinuto[1]);
    } catch (error) {
        throw new Error("Erro ao transformar a data e hora! :(");
    }
}

exports.diferencaEntreData = (dataInicial, dataFinal) => {
    const arrayDataInicial = dataInicial.split("/");
    const arrayDataFinal = dataFinal.split("/");
    var diferenca = Math.abs(new Date(arrayDataInicial[2]
        ,arrayDataInicial[1]
        , arrayDataInicial[0]) - new Date(arrayDataFinal[2]
                                            ,arrayDataFinal[1]
                                            ,arrayDataFinal[0])); //diferença em milésimos e positivo
    var dia = 1000 * 60 * 60 * 24; // milésimos de segundo correspondente a um dia
    var total = Math.round(diferenca / dia); //valor total de dias arredondado
    
    return total;
}

exports.diferencaEntreDataComBaseAnoHipico = (year, month, day) =>{
    var now = new Date()	
    var age = now.getFullYear();    
    var monthNow = now.getMonth();
    var dayNow = now.getDate();

   if((month > 6) || (month == 6 && day > 1)){
        if((monthNow > month) || (monthNow == month && dayNow >= day)){
            age -= 1;
        }
    }

    let idade = age -  year;
    var mdif = 6 - month + 1 //0=jan	
    
    if(mdif < 0){
      --idade
    }else if(mdif == 0){
        var ddif = 1 - day        
        if(ddif < 0){
            --idade
        }
    }

    return idade;
}

exports.formatarData = (data) => {
    //retorna data no formato yyyy-mm-dd
    let d = [
        '0' + data.getDate(),
        '0' + (data.getMonth() + 1)
    ].map(component => component.slice(-2));
    d.push(data.getFullYear() + '');
    return d[2] + '-' + d[1] + '-' + d[0];
}

exports.formatarDataDmY = (data) => {
    //retorna data no formato yyyy-mm-dd
    let d = [
        '0' + data.getDate(),
        '0' + (data.getMonth() + 1)
    ].map(component => component.slice(-2));
    d.push(data.getFullYear() + '');
    return d[0] + '-' + d[1] + '-' + d[2];
}

exports.formatarStringDataDmY = (data) => {
    //data => dd-mm-yyy ou dd/mm/yyyy
    //retorna data no formato yyyy-mm-dd
    let d;
    if(data.split("/").length == 3){
        d = data.split("/");
    }else{
        d = data.split("-");
    }
    let date = data;
    return d[2] + '-' + d[1] + '-' + d[0];
}

exports.getSexoCavalo = (sexo) => {
    let retorno = '----';
    switch (sexo.toLocaleLowerCase()) {
      case 'm': retorno = 'Macho'; break;
      case 'f': retorno = 'Fêmea'; break;
      case 'c': retorno = 'Puro Castrado'; break;
      case 'mc': retorno = 'Mestiço Castrado'; break;
      case 'mac': retorno = 'Macho Castrado'; break;
      default: break;
    }
    return retorno;
};

exports.clonaArray = (array) => {
    let retorno = [];
    if(array && array.length > 0){
        retorno = JSON.parse(JSON.stringify(array));
    }
    return retorno;
};