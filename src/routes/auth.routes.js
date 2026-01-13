/**
 * Importamos todo lo necesario para las rutas de autenticación de usuarios
 */
const express = require('express');
const { register, login, perfil, logout } = require('../controllers/auth.controller');
const { authMiddleware } = require('../middleware/auth');

const router = express.Router();

/**
 * REGISTRO
 */
router.post('/register', register);

/**
 * LOGIN
 */
router.post('/login', login);

/**
 * LOGOUT - borra cookie del token
 */
router.post('/logout', logout);

/**
 * PERFIL - requiere middleware auth (token en cookie o header)
 */
router.get('/perfil', authMiddleware, perfil);

module.exports = router;