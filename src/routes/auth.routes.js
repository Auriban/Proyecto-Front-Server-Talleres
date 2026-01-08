/**
 * Importamos todo lo necesario para las rutas de autenticación de usuarios
 */
const express = require('express');
const { register, login, perfil } = require('../controllers/auth.controller');
const { authMiddleware } = require('../middleware/auth');

const router = express.Router();

/**
 * REGISTRO - Crea un nuevo usuario
 * 
 * Recibe email, password, name y role
 * Verifica que el email no exista ya
 * Encripta la contraseña y guarda el usuario
 * Devuelve token JWT y datos del usuario
 */
router.post('/register', register);

/**
 * LOGIN - Inicia sesión y devuelve token
 * 
 * Recibe email y password
 * Verifica usuario y contraseña
 * Devuelve token JWT y datos del usuario
 */
router.post('/login', login);

/**
 * PERFIL - Obtiene datos del usuario logueado
 * 
 * Solo accesible con token válido (authMiddleware)
 * Devuelve los datos del usuario desde req.usuario
 */
router.get('/perfil', authMiddleware, perfil);

module.exports = router;
