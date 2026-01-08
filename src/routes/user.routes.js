/**
 * Importamos todo lo necesario para las rutas de usuarios
 */
const express = require('express');
const { check } = require('express-validator');
const validateInput = require('../middleware/validateInput');
const { authMiddleware, esAdmin } = require('../middleware/auth');
const { 
  getUsuarios, 
  crearUsuario, 
  actualizarUsuario, 
  eliminarUsuario 
} = require('../controllers/user.controller');

const route = express.Router();

/**
 * GET /usuarios/ - Lista todos los usuarios
 * Solo admin puede ver la lista completa
 */
route.get('/', authMiddleware, esAdmin, getUsuarios);

/**
 * POST /usuarios/ - Crear nuevo usuario
 * Solo admin puede crear usuarios
 * 
 * Validaciones: nombre, email válido, contraseña fuerte, rol válido
 */
route.post('/', authMiddleware, esAdmin, [
  /** 
   * Nombre obligatorio, mínimo 2 caracteres 
   * */
  check('name')
    .notEmpty()
    .withMessage('El nombre es obligatorio')
    .isLength({ min: 2, max: 50 })
    .withMessage('Nombre entre 2 y 50 caracteres'),

  /** 
   * Email obligatorio y formato válido 
   * */
  check('email')
    .notEmpty()
    .withMessage('El email es obligatorio')
    .isEmail()
    .withMessage('Email no válido'),

  /** 
   * Contraseña fuerte: mínimo 6 caracteres 
   * */
  check('password')
    .notEmpty()
    .withMessage('La contraseña es obligatoria')
    .isLength({ min: 6 })
    .withMessage('Mínimo 6 caracteres para contraseña'),

  /** 
   * Rol válido: solo 'admin' o 'user' 
   * */
  check('rol')
    .optional()
    .isIn(['user', 'admin'])
    .withMessage('Rol debe ser "user" o "admin"'),

  validateInput
], crearUsuario);

/**
 * PUT /usuarios/:id - Actualizar usuario existente
 * Solo admin puede modificar usuarios
 * 
 * ID en la URL, datos nuevos en body
 * Contraseña opcional pero si viene debe ser fuerte
 */
route.put('/:id', authMiddleware, esAdmin, [
  /** 
   * Nombre opcional pero si viene, debe ser válido
   *  */
  check('name')
    .optional()
    .isLength({ min: 2, max: 50 })
    .withMessage('Nombre entre 2 y 50 caracteres'),

  /** 
   * Email opcional pero debe ser único y válido
   *  */
  check('email')
    .optional()
    .isEmail()
    .withMessage('Email no válido'),

  /** 
   * Contraseña opcional pero fuerte si se cambia 
   * */
  check('password')
    .optional()
    .isLength({ min: 6 })
    .withMessage('Mínimo 6 caracteres para nueva contraseña'),

  /** 
   * Rol opcional pero válido 
   * */
  check('rol')
    .optional()
    .isIn(['user', 'admin'])
    .withMessage('Rol debe ser "user" o "admin"'),

  validateInput
], actualizarUsuario);

/**
 * DELETE /usuarios/:id - Eliminar usuario por ID
 * Solo admin puede borrar usuarios
 */
route.delete('/:id', authMiddleware, esAdmin, eliminarUsuario);

module.exports = route;
