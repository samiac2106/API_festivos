const express = require('express');
const app = express();
const puerto = 3030

//Conectarse a la base de datos
const bd = require('./repositorios/bd');
bd.conectar();

require('./rutas/festivo.rutas')(app);

app.get('/', (req, res) => {
    res.send('Hola Mundo')
});

app.listen(puerto, () => {
    console.log(`Servicio escuchando en http://localhost:${puerto}`)
});

