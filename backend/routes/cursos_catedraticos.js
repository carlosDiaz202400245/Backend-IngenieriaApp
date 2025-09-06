const {Router} = require('express');
const { getCursos, getProfesores } = require('../controllers/Cursos_catedraticos');
const router = Router();

router.get('/cursos', getCursos)
router.get('/profesores', getProfesores)
module.exports = router;