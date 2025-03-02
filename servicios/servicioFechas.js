function obtenerSemanaSanta(año) {
    const a = año % 19;
    const b = año % 4;
    const c = año % 7;
    const d = (19 * a + 24) % 30;
 
    const dias = d + (2 * b + 4 * c + 6 * d + 5) % 7;
 
    let mes = 3;
    let dia = 15 + dias;
    if (dia > 31) {
        mes = 4;
        dia = dia - 31;
    }
    return new Date(año, mes - 1, dia);
}

function agregarDias(fecha, dias) {
    let fechaCalculada = new Date(fecha);
    fechaCalculada.setDate(fechaCalculada.getDate() + dias);
    return fechaCalculada;
}

function siguienteLunes(fecha) {
    let fechaCalculada = new Date(fecha);
    const diaSemana = fechaCalculada.getDay();

    if (diaSemana !== 1 && diaSemana !== 0) { // Si no es lunes (1), se traslada al siguiente lunes
        fechaCalculada = agregarDias(fechaCalculada, 8 - diaSemana);

    }else if(diaSemana === 0){
        fechaCalculada = agregarDias(fechaCalculada, 1);
    }
    return fechaCalculada;
}

module.exports = {
    obtenerSemanaSanta,
    agregarDias,
    siguienteLunes
}