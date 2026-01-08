/**
 * Importamos todo lo necesario para las rutas de talleres
 */
const express = require('express');
const { check } = require('express-validator');
const validateInput = require('../middleware/validateInput');
const upload = require('../middleware/uploads.middleware');
const { authMiddleware, esAdmin } = require('../middleware/auth');

/**
 * Creamos una instancia del enrutador para talleres
 * Aquí definimos todas las rutas relacionadas con talleres
 */
const route = express.Router();

/**
 * Importamos las funciones del controlador de talleres
 * Estas se ejecutan cuando alguien accede a las rutas
 */
const {
    getAllTalleres,
    createTaller,
    getTallerPorId,
    updateTaller, 
    deleteTaller
} = require('../controllers/taller.controller');

/**
 * GET /talleres/
 * Público - Obtiene TODOS los talleres
 * Cualquier persona puede ver la lista
 */
route.get('/', getAllTalleres);

/**
 * GET /talleres/:id
 * Público - Obtiene UN taller específico por ID
 * Cualquier persona puede ver un taller individual
 */
route.get('/:id', getTallerPorId);  

/**
 * POST /talleres/creartaller
 * Solo ADMIN - Crea un nuevo taller
 * 
 * Requiere: login + rol admin + imagen (imgTaller)
 * Valida todos los campos antes de crear
 * Sube imagen con multer
 */
route.post('/creartaller', authMiddleware, esAdmin, upload.single('imgTaller'), [
    /** 
     * Valida título obligatorio y mínimo 3 caracteres 
     * */
    check('titulo')
        .notEmpty()
        .withMessage('El título es obligatorio')
        .isLength({ min: 3 })
        .withMessage('Mínimo 3 caracteres'),

    /** 
     * Valida descripción obligatoria 
     * */
    check('descripcion')
        .notEmpty()
        .withMessage('La descripción es obligatoria'),

    /** 
     * Valida precio número positivo 
     * */
    check('precio')
        .isFloat({ min: 0 })
        .withMessage('El precio debe ser un número válido'),

    /** Valida fecha - formato ISO */
    check('fecha')
        .isISO8601()
        .withMessage('La fecha no es válida'),

    /** 
     * Valida categoría obligatoria
     *  */
    check('categoria')
        .notEmpty()
        .withMessage('La categoría es obligatoria'),

    validateInput
], createTaller);

/**
 * PUT /talleres/editartaller/:id
 * Solo ADMIN - Actualiza un taller existente
 * 
 * ID en la URL, datos nuevos en body
 * Puede cambiar imagen también
 * Mismas validaciones que crear
 */
route.put('/editartaller/:id', authMiddleware, esAdmin, upload.single('imgTaller'), [
    /** 
     * Mismas validaciones que POST 
     * */
    check('titulo')
        .notEmpty()
        .withMessage('El título es obligatorio')
        .isLength({ min: 3 })
        .withMessage('Mínimo 3 caracteres'),

    check('descripcion')
        .notEmpty()
        .withMessage('La descripción es obligatoria'),

    check('precio')
        .isFloat({ min: 0 })
        .withMessage('El precio debe ser un número válido'),

    check('fecha')
        .isISO8601()
        .withMessage('La fecha no es válida'),

    check('categoria')
        .notEmpty()
        .withMessage('La categoría es obligatoria'),

    validateInput
], updateTaller);

/**
 * DELETE /talleres/eliminartaller/:id
 * Solo ADMIN - Elimina un taller por ID
 * 
 * Requiere login + ser admin
 */
route.delete('/eliminartaller/:id', authMiddleware, esAdmin, deleteTaller);

/**
 * Exportamos las rutas para usar en app.js
 * Se conecta con: app.use('/api/talleres', tallerRoutes);
 */
module.exports = route;
