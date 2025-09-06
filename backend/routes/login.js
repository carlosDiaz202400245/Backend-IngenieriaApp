const { Router } = require('express');
const router = Router();
const { login, lostPassword, newPassword, register } = require('../controllers/Login');

router.post('/login', login);
router.post('/register', register);
router.post('/lostPassword', lostPassword);
router.post('/newPassword', newPassword);

module.exports = router;