const express = require('express')
const { dbConection } = require('../database/connector')

const getUsers = async(req, res) => {
    try {
        const db = await dbConection();
        const [usuarios] = await db.query('SELECT * FROM usuario');
        res.status(200).json({
            message: 'Usuarios obtenidos correctamente',
            data: usuarios
        });

        console.log('Usuarios obtenidos correctamente:' + usuarios);
        
    } catch (error) {
        console.error('Error obteniendo usuarios:', error);
        res.status(500).json({ error: 'Error en el servidor' });
    }
}

const UpdateMyUser = async(req, res) => {
    console.log(req.session.registro_academico);    
    const registro_academico = req.session.registro_academico;
    console.log(registro_academico);
    try {
        if (registro_academico !== req.session.registro_academico) {
            return res.status(401).json({ error: 'No autorizado' });
        }
        const { nombres, apellidos, correo, password } = req.body;
        
        if (!nombres || !apellidos || !correo || !password) {
            return res.status(400).json({ error: 'Todos los campos son requeridos' });
        }

        const db = await dbConection();
        const [correoRepeted] = await db.query('SELECT * FROM usuario WHERE correo = ?', [correo]);
        const [MyCorreo] = await db.query('SELECT correo FROM usuario WHERE registro_academico = ?', [registro_academico]);
        if (correoRepeted.length > 0 && !MyCorreo[0]) {
            return res.status(400).json({ error: 'El correo ya está en uso, tienes que usar un correo tuyo u otro' });
        }
        
        const [result] = await db.query('UPDATE usuario SET nombres = ?, apellidos = ?, correo = ?, password = ? WHERE registro_academico = ?', [nombres, apellidos, correo, password, registro_academico]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'No se pudo actualizar el usuario' });
        }

        return res.status(200).json({
            message: 'Perfil Actualizado Correctamente'
        });
        
    } catch (error) {
        console.error('Error al actualizar el usuario:', error);
        res.status(500).json({ error: 'Error en el servidor' });
    }
}

const cursosAprobados = async(req, res) => {
    const registro_academico = req.session.registro_academico;
    try {
        
        if (registro_academico === null) {
            return res.status(401).json({ error: 'No autorizado, inicia sesion primero.' });
        }

        const db = await dbConection();
        const {curso_id} = req.body;
        const [cursoRepeted] = await db.query('SELECT * FROM cursos_aprobados WHERE curso_id = ? AND usuario_id = ?', [curso_id, registro_academico]);
        if (cursoRepeted.length > 0) {
            return res.status(400).json({ error: 'El curso ya fue aprobado' });
        }
        const [totalCursos] = await db.query('SELECT COUNT(*) AS total_cursos FROM curso');
        if (curso_id > totalCursos[0].total_cursos) {
            return res.status(400).json({ error: 'El id del curso no existe' });
        }
        const [cursos] = await db.query('INSERT INTO cursos_aprobados (usuario_id, curso_id) VALUES(?, ?)', [registro_academico, curso_id]);
        res.status(200).json({
            mensaje: 'Curso aprobado correctamente',
            data: cursos
        });
    } catch (error) {
        console.error('Error en la obtención de cursos aprobados:', error);
        res.status(500).json({ error: 'Error en el servidor' });
    }
}

const deleteCursosAprobados = async(req, res) => {
    const registro_academico = req.session.registro_academico;
    const { id } = req.params;
    try {
        const db = await dbConection();
        await db.query('DELETE FROM cursos_aprobados WHERE usuario_id = ? AND curso_id = ?', [registro_academico, id]);
        res.status(200).json({ message: 'Curso eliminado' });
    } catch (error) {
        console.error('Error en la eliminación de curso:', error);
        res.status(500).json({ error: 'Error en el servidor' });
    }
}


module.exports = {
    getUsers,
    UpdateMyUser,
    cursosAprobados,
    deleteCursosAprobados
}