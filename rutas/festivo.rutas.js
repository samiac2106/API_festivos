module.exports = (app) => {
    const controlador = require("../controladores/festivo.controlador");

    app.get("/festivos", controlador.listar);
    app.get("/validar-festivo/:fecha", controlador.validarFestivo);

}