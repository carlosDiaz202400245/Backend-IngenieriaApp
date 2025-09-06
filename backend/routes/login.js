const {Router} = require('express');
const router = Router();
const {login, lostPassword, newPassword, register} = require('../controllers/Login');

router.post('/login', login);

router.post('/lostPassword', lostPassword);
router.post('/newPassword', newPassword);
router.post('/register', register);

module.exports = router;