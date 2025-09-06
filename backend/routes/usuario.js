const {Router} = require('express');
const router = Router();
const {getUsers, UpdateMyUser, cursosAprobados, deleteCursosAprobados} = require('../controllers/Usuario');

router.get('/ver', getUsers);
router.post('/actualizarMiPerfil', UpdateMyUser);

router.post('/cursosAprovados', cursosAprobados);

router.delete('/deleteMiPubli/:id', deleteCursosAprobados);

module.exports = router;
