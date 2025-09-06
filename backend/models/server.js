const express = require('express')
const cors = require('cors')
const { dbConection } = require('../database/connector')
const session = require('express-session')

class Server {
    constructor() {
        this.app = express();
        this.port = process.env.PORT || 8080;
        this.app.get('/', (req, res) => {
            res.send("PAGINA DE INICIO")
        })

        this.conectarDB();

        this.middlewares();

        this.routes();
    }

    async conectarDB() {
        await dbConection();
    }

    middlewares() {
        this.app.use(cors({
            origin: 'http://localhost:5173',
            credentials: true,
            methods: ['GET', 'POST', 'PUT', 'DELETE'],
            allowedHeaders: ['Content-Type', 'Authorization']
        }));

        this.app.use(session({
            secret: 'clave-secreta',
            resave: false,
            saveUninitialized: true,
            cookie: {
                secure: false,
                httpOnly: true,
                maxAge: 24 * 60 * 60 * 1000
            }
        }));

        this.app.use(express.json());
    }

    routes() {
        this.app.use("/api", require('../routes/login'));
        this.app.use("/api/publis", require('../routes/publicacion'));
        this.app.use("/api/usuario", require('../routes/usuario'));
        this.app.use("/api/cursos", require('../routes/cursos_catedraticos'));
    }

    listen() {
        this.app.listen(this.port, () => {
            console.log('Servidor corriendo en el puerto', this.port);
        })
    }
}

module.exports = Server;