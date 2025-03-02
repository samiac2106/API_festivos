const festivoRepositorio = require("../repositorios/festivo.repositorio");

exports.listar = (solicitud, respuesta) => {
    festivoRepositorio.listar((error, datos) => {
        if (error) {
            return respuesta.status(500).send({
                mensaje: "Error obteniendo la lista de Paises"
            });
        }
        return respuesta.send(datos);
    })
}

exports.validarFestivo = (solicitud, respuesta) => {
    const fechaParam = solicitud.params.fecha; // Obtener la fecha desde el parámetro de la URL
    const fecha = new Date(`${fechaParam}T00:00:00`); // Asegurar que se interprete correctamente

    if (isNaN(fecha.getTime())) {
        return respuesta.status(400).send({ mensaje: "Fecha no válida" });
    }

    festivoRepositorio.validarFestivo(fecha, (error, resultado) => {
        if (error) {
            return respuesta.status(500).send({ mensaje: "Error validando la fecha festiva" });
        }
        return respuesta.send(resultado);
    });
};


