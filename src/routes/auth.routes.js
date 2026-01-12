/**
 * Importamos todo lo necesario para las rutas de autenticación de usuarios
 */
const express = require('express');
const { register, login, perfil } = require('../controllers/auth.controller');
const { authMiddleware } = require('../middleware/auth');

const router = express.Router();

/**
 * @openapi
 * /api/auth/register:
 *   post:
 *     tags:
 *       - Auth
 *     summary: Registro de usuario
 *     description: Crea un nuevo usuario y devuelve un token JWT + datos del usuario.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RegisterBody'
 *           example:
 *             name: "Pepe"
 *             email: "pepe@mail.com"
 *             password: "123456"
 *             role: "user"
 *     responses:
 *       201:
 *         description: Usuario creado correctamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuthResponse'
 *       400:
 *         description: Error de validación
 */

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
 * @openapi
 * /api/auth/login:
 *   post:
 *     tags:
 *       - Auth
 *     summary: Login de usuario
 *     description: Inicia sesión con email y password. Devuelve token JWT y datos del usuario.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoginBody'
 *           example:
 *             email: "pepe@mail.com"
 *             password: "123456"
 *     responses:
 *       200:
 *         description: Login correcto
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuthResponse'
 *       401:
 *         description: Credenciales inválidas
 */

/**
 * LOGIN - Inicia sesión y devuelve token
 * 
 * Recibe email y password
 * Verifica usuario y contraseña
 * Devuelve token JWT y datos del usuario
 */
router.post('/login', login);


/**
 * @openapi
 * /api/auth/perfil:
 *   get:
 *     tags:
 *       - Auth
 *     summary: Perfil del usuario autenticado
 *     description: Devuelve los datos del usuario extraídos de req.usuario. Requiere token.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Perfil obtenido correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 usuario:
 *                   $ref: '#/components/schemas/User'
 *       401:
 *         description: Token faltante o inválido
 */
/**
 * PERFIL - Obtiene datos del usuario logueado
 * 
 * Solo accesible con token válido (authMiddleware)
 * Devuelve los datos del usuario desde req.usuario
 */
router.get('/perfil', authMiddleware, perfil);

module.exports = router;
