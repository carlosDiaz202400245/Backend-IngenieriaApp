const express = require('express');
const { dbConection } = require('../database/connector');

const getCursos = async (req, res) => {
    try {
        const db = await dbConection();
        const [cursos] = await db.query('SELECT * FROM curso');
        res.status(200).json(cursos);
    } catch (error) {
        console.error('Error en la obtención de cursos:', error);
        res.status(500).json({ error: 'Error en el servidor' });
    }
}

const getProfesores = async (req, res) => {
    try {
        const db = await dbConection();
        const [profesores] = await db.query('SELECT profesor.id AS profesor_id, profesor.nombres AS profesor_nombre, profesor.apellidos AS profesor_apellido, curso.nombre AS curso_nombre FROM profesor JOIN curso ON profesor.cursos = curso.id');
        res.status(200).json(profesores);
    } catch (error) {
        console.error('Error en la obtención de profesores:', error);
        res.status(500).json({ error: 'Error en el servidor' });
    }
}

module.exports = {  
    getCursos,
    getProfesores
}
