const {Router} = require('express');
const { getPublicaciones, getMisPublicaciones, createPublicacion, deleteMiPublicacion, 
        getComentarios, 
        createComentario,
        deleteMiComentario} = require('../controllers/Publicaciones');
const router = Router();

router.get('/publicaciones', getPublicaciones);
router.get('/misPublicaciones', getMisPublicaciones);

router.post('/publicar', createPublicacion);

router.delete('/deleteMiPubli/:id', deleteMiPublicacion);

// ------------ COMENTARIOS ------------
router.get('/comentarios/:id', getComentarios);

router.post('/comentar/:id', createComentario);

router.delete('/deleteMiComentario/:id', deleteMiComentario);
module.exports = router;