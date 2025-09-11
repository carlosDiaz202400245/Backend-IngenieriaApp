const mysql = require('mysql2/promise')

const dbConection = async () => {
    try {
        const connection = await mysql.createConnection({
            host: 'localhost',
            database: 'foro_ingenieria_db',
            user: 'root',
            password: 'admin'
        });

        console.log('Conexión exitosa a la base de datos');
        return connection; // Retorna la conexión para usarla después si es necesario
    } catch (error) {
        console.error('Error de conexión:', error.message);
        throw error;
    }
};

module.exports = { dbConection };
