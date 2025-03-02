const bd = require('./bd');
const { obtenerSemanaSanta, agregarDias, siguienteLunes } = require('../servicios/servicioFechas');

const FestivoRepositorio = () => { };

// Endpoint para listar los festivos
FestivoRepositorio.listar = async (respuesta) => {
    const basedatos = bd.obtenerBD();

    try {
        //***** codigo MONGO para obtener la lista de festivos
        const resultado = await basedatos.collection("tipos")
            .find({})
            .project({
                id: 1,
                tipo: 1,
                modoCalculo: 1,
                "festivos.dia": 1,
                "festivos.mes": 1,
                "festivos.nombre": 1,
            })
            .toArray();
        //***** 

        return respuesta(null, resultado);
    }
    catch (error) {
        return respuesta(error, null);
    }
}


//Endpoint para validar si la fecha es festiva
FestivoRepositorio.validarFestivo = async (fecha, respuesta) => {
    const basedatos = bd.obtenerBD();

    try {
        // Obtener todos los tipos de festivos desde la base de datos
        const resultado = await basedatos.collection("tipos")
            .find({})
            .project({
                id: 1,
                tipo: 1,
                modoCalculo: 1,
                "festivos.dia": 1,
                "festivos.mes": 1,
                "festivos.nombre": 1,
                "festivos.diasPascua": 1 // Incluir días de Pascua si están definidos
            })
            .toArray();

        const año = fecha.getFullYear();
        const domingoPascua = agregarDias(obtenerSemanaSanta(año), 7); // Calcular el Domingo de Ramos (Semana Santa)

        let esFestivo = false; // Bandera para indicar si la fecha es festiva
        let nombreFestivo = ''; // Nombre del festivo (si es festivo)
        let fechaFestivoTrasladado = null; // Fecha trasladada (si aplica)

        // Recorrer todos los tipos de festivos
        resultado.forEach(tipo => {
            tipo.festivos.forEach(f => {
                let festivoFecha = new Date(año, f.mes - 1, f.dia); // Fecha base del festivo

                // Si el festivo está basado en el Domingo de Pascua
                if (f.diasPascua !== undefined) {
                    festivoFecha = agregarDias(domingoPascua, f.diasPascua); // Calcular la fecha sumando días al Domingo de Pascua
                    const fechaTrasladada = siguienteLunes(festivoFecha);
                }

                // Si el festivo está sujeto a la Ley de Puente Festivo, trasladar al siguiente lunes
                if (tipo.modoCalculo.includes('Se traslada la fecha al siguiente lunes') || tipo.id === 4) {
                    const fechaTrasladada = siguienteLunes(festivoFecha);
                    if (fecha.toDateString() === fechaTrasladada.toDateString()) {
                        esFestivo = true;
                        nombreFestivo = f.nombre;
                        //fechaFestivoTrasladado = fechaTrasladada.toISOString().split('T')[0];
                    }
                }
                //Comparar la fecha proporcionada con la fecha calculada del festivos
                if (fecha.toDateString() === festivoFecha.toDateString()) { 
                    esFestivo = true;
                    nombreFestivo = f.nombre;
                    if (tipo.modoCalculo.includes('Se traslada la fecha al siguiente lunes') || tipo.id === 4) {
                        fechaFestivoTrasladado = siguienteLunes(festivoFecha).toISOString().split('T')[0];
                    }
                }
            });
        });

        // Devolver el resultado de la validacións
        return respuesta(null, {
            fecha: fecha.toISOString().split('T')[0], // Fecha en formato YYYY-MM-DD
            esFestivo, // true si es festivo, false si no
            nombreFestivo, // Nombre del festivo (si es festivo)
            fechaFestivoTrasladado, // Fecha trasladada (si aplica)
            mensaje: esFestivo 
                ? `La fecha ${fecha.toISOString().split('T')[0]} es festivo: ${nombreFestivo}` + 
                (fechaFestivoTrasladado ? ` (trasladado al ${fechaFestivoTrasladado})` : '')
                : `La fecha ${fecha.toISOString().split('T')[0]} no es festiva`
        });
        
        
    } catch (error) {
        // Manejar errores
        return respuesta(error, null);
    }
};

module.exports = FestivoRepositorio;