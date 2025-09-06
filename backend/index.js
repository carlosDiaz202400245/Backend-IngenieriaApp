
// ---------------------------------------------
// importaciones principales
require('dotenv').config();

const Server = require('./models/server')

//Instancia del servidor de arranque
const servidorIniciado = new Server();

//Llamar al metodo listen para levantar el servidor
servidorIniciado.listen();

