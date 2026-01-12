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
 * @openapi
 * /api/talleres:
 *   get:
 *     tags:
 *       - Talleres
 *     summary: Obtener todos los talleres
 *     description: Devuelve la lista completa de talleres. Ruta pública.
 *     responses:
 *       200:
 *         description: Lista de talleres
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Taller'
 */
/**
 * GET /talleres/
 * Público - Obtiene TODOS los talleres
 * Cualquier persona puede ver la lista
 */
route.get('/', getAllTalleres);

/**
 * @openapi
 * /api/talleres/{id}:
 *   get:
 *     tags:
 *       - Talleres
 *     summary: Obtener un taller por ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del taller
 *     responses:
 *       200:
 *         description: Taller encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Taller'
 *       404:
 *         description: Taller no encontrado
 */
/**
 * GET /talleres/:id
 * Público - Obtiene UN taller específico por ID
 * Cualquier persona puede ver un taller individual
 */
route.get('/:id', getTallerPorId);  

/**
 * @openapi
 * /api/talleres/creartaller:
 *   post:
 *     tags:
 *       - Talleres
 *     summary: Crear un taller (solo admin)
 *     description: Crea un nuevo taller. Puede incluir una imagen en el campo `imgTaller`.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               titulo:
 *                 type: string
 *               descripcion:
 *                 type: string
 *               precio:
 *                 type: number
 *               fecha:
 *                 type: string
 *                 format: date
 *               categoria:
 *                 type: string
 *               imgTaller:
 *                 type: string
 *                 format: binary
 *           encoding:
 *             imgTaller:
 *               contentType: image/png, image/jpeg
 *     responses:
 *       201:
 *         description: Taller creado
 *       400:
 *         description: Error de validación
 *       401:
 *         description: No autorizado
 *       403:
 *         description: Sin permisos (no admin)
 */

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
 * @openapi
 * /api/talleres/editartaller/{id}:
 *   put:
 *     tags:
 *       - Talleres
 *     summary: Actualizar taller (solo admin)
 *     description: Actualiza un taller existente. Puede cambiar la imagen subiendo `imgTaller`.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del taller a actualizar
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               titulo:
 *                 type: string
 *               descripcion:
 *                 type: string
 *               precio:
 *                 type: number
 *               fecha:
 *                 type: string
 *                 format: date
 *               categoria:
 *                 type: string
 *               imgTaller:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Taller actualizado
 *       400:
 *         description: Error de validación
 *       401:
 *         description: No autorizado
 *       403:
 *         description: Sin permisos (no admin)
 *       404:
 *         description: Taller no encontrado
 */
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
 * @openapi
 * /api/talleres/eliminartaller/{id}:
 *   delete:
 *     tags:
 *       - Talleres
 *     summary: Eliminar taller por ID (solo admin)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del taller a eliminar
 *     responses:
 *       200:
 *         description: Taller eliminado
 *       401:
 *         description: No autorizado
 *       403:
 *         description: Sin permisos (no admin)
 *       404:
 *         description: Taller no encontrado
 */

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
