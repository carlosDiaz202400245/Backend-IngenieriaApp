const express = require('express')
const { dbConection } = require('../database/connector')

const login = async (req, res) => {
    try {
        const { registro_academico, password } = req.body;
        
        if (!registro_academico || !password) {
            return res.status(400).json({ error: 'Registro académico y contraseña son requeridos' });
        }
        
        const db = await dbConection();
        const [loged] = await db.query('SELECT * FROM usuario WHERE registro_academico = ? AND password = ?', [registro_academico, password]);
        
        if (loged.length === 0) {
            return res.status(401).json({ error: 'Credenciales incorrectas' });
        }

        req.session.registro_academico = loged[0].registro_academico;
        console.log(req.session.registro_academico);
        
        console.log("continua el proceso");
        
        res.status(200).json({
            message: 'Inicio de sesión exitoso',
            data: loged[0],
            registro_academico: loged[0].registro_academico
        });
        
    } catch (error) {
        console.error('Error en el login:', error);
        res.status(500).json({ error: 'Error en el servidor' });
    }
};

const lostPassword = async (req, res) => {
    try {
        const { registro_academico, correo } = req.body;
        
        if (!registro_academico || !correo) {
            return res.status(400).json({ error: 'Registro académico o correo es requerido' });
        }
        
        const db = await dbConection();
        const [user] = await db.query('SELECT * FROM usuario WHERE registro_academico = ? AND correo = ?', [registro_academico, correo]);
        
        if (user.length === 0) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }
        
        req.session.registro_academico = registro_academico;

        res.status(200).json({
            message: 'Usuario encontrado',
            data: user[0]
        });
        
    } catch (error) {
        console.error('Error en la recuperación de contraseña:', error);
        res.status(500).json({ error: 'Error en el servidor' });
    }
}

const newPassword = async (req, res) => {
    try {
        const { password } = req.body;
        
        if (!password) {
            return res.status(400).json({ error: 'Nueva contraseña es requerida' });
        }
        
        const registro = req.session.registro_academico;
        if (!registro) {
            return res.status(400).json({ error: 'Registro académico no encontrado' });
        }
        const db = await dbConection();
        const [result] = await db.query('UPDATE usuario SET password = ? WHERE registro_academico = ?', [password, registro]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'No se pudo actualizar la contraseña' });
        }

        // Eliminar el registro de la sesión después de actualizar
        req.session.registro_academico = null;

        return res.status(200).json({
            message: 'Contraseña actualizada'
        });
        
    } catch (error) {
        console.error('Error en la recuperación de contraseña:', error);
        res.status(500).json({ error: 'Error en el servidor' });
    }
}

const register = async(req, res) =>{
    const {registro_academico, nombres, apellidos, correo, password} = req.body;
    if (!registro_academico || !nombres || !apellidos || !correo || !password) {
        return res.status(400).json({ error: 'Todos los campos son requeridos' });
    }
    try {
        const db = await dbConection();
        const [userRepeted] = await db.query('SELECT * FROM usuario WHERE registro_academico = ?', [registro_academico]);
        if (userRepeted.length > 0) {
            return res.status(400).json({ error: 'El registro académico ya está registrado, intenta otro' });
        }
        const [correoRepeted] = await db.query('SELECT * FROM usuario WHERE correo = ?', [correo]);
        if (correoRepeted.length > 0) {
            return res.status(400).json({ error: 'El correo ya está registrado, intenta otro' });
        }

        const [result] = await db.query('INSERT INTO usuario (registro_academico, nombres, apellidos, correo, password) VALUES (?, ?, ?, ?, ?)', [registro_academico, nombres, apellidos, correo, password]);
        if (result.affectedRows === 1) {
            return res.status(201).json({
                message: 'Usuario registrado correctamente'
            });
        }
    } catch (error) {
        console.error('Error en el registro:', error);
        res.status(500).json({ error: 'Error en el servidor' });
    }
}

module.exports = {
    login,
    lostPassword,
    newPassword,
    register
}