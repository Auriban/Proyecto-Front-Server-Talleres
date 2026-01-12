const express = require('express');
const { authMiddleware } = require('../middleware/auth');
const Taller = require('../models/taller.model'); 
const Inscripcion = require('../models/inscripcion.model');

const router = express.Router();

/**
 * @openapi
 * /api/inscripciones:
 *   post:
 *     tags:
 *       - Inscripciones
 *     summary: Inscribir usuario a un taller
 *     description: Crea una inscripción para el usuario autenticado. No permite inscripciones duplicadas.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               tallerId:
 *                 type: string
 *                 example: "6123taller1234567890"
 *             required:
 *               - tallerId
 *     responses:
 *       200:
 *         description: Inscripción creada correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 ok:
 *                   type: boolean
 *                   example: true
 *                 msg:
 *                   type: string
 *                   example: "Inscrito correctamente"
 *                 inscripcion:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                       example: "61a1abc..."
 *                     usuario:
 *                       type: string
 *                       example: "6123user..."
 *                     taller:
 *                       type: string
 *                       example: "6123taller..."
 *                     fechaInscripcion:
 *                       type: string
 *                       example: "2026-01-11T08:00:00.000Z"
 *       400:
 *         description: Ya inscrito o datos inválidos
 *       401:
 *         description: No autorizado
 */
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { tallerId } = req.body;
    
    // Verifica que ya no esté inscrito
    const yaInscrito = await Inscripcion.findOne({
      usuario: req.usuario._id,
      taller: tallerId
    });
    
    if (yaInscrito) {
      return res.status(400).json({
        ok: false,
        msg: 'Ya estás inscrito en este taller'
      });
    }

    // Crea la inscripción
    const inscripcion = new Inscripcion({
      usuario: req.usuario._id,
      taller: tallerId
    });
    
    await inscripcion.save();
    
    res.json({
      ok: true,
      msg: 'Inscrito correctamente',
      inscripcion
    });
    
  } catch (error) {
    console.error('Error inscripción:', error);
    res.status(500).json({
      ok: false,
      msg: 'Error al inscribir'
    });
  }
});

/**
 * @openapi
 * /api/inscripciones:
 *   get:
 *     tags:
 *       - Inscripciones
 *     summary: Obtener inscripciones del usuario
 *     description: Devuelve las inscripciones del usuario autenticado. Cada item incluye la información del taller.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de inscripciones
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 ok:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                         example: "61a1abc..."
 *                       fechaInscripcion:
 *                         type: string
 *                         example: "2026-01-11T08:00:00.000Z"
 *                       taller:
 *                         type: object
 *                         properties:
 *                           _id:
 *                             type: string
 *                             example: "615fabc..."
 *                           titulo:
 *                             type: string
 *                             example: "Taller de pintura"
 *                           descripcion:
 *                             type: string
 *                             example: "Aprende a pintar con acuarela"
 *                           precio:
 *                             type: number
 *                             example: 25
 *                           fecha:
 *                             type: string
 *                             example: "2026-03-15"
 *                           categoria:
 *                             type: string
 *                             example: "arte"
 *       401:
 *         description: No autorizado
 */
router.get('/', authMiddleware, async (req, res) => {
  try {
    // Busca inscripciones del usuario
    const inscripciones = await Inscripcion.find({ 
      usuario: req.usuario._id 
    });

    //Para cada inscripción, busca el taller por separado
    const talleresCompletos = [];
    for (let inscrip of inscripciones) {
      const taller = await Taller.findById(inscrip.taller);
      talleresCompletos.push({
        _id: inscrip._id,          
        fechaInscripcion: inscrip.fechaInscripcion,
        taller: taller
      });
    }
    res.json({
      ok: true,
      data: talleresCompletos
    });
    
  } catch (error) {
    res.status(500).json({ ok: false, msg: 'Error' });
  }
});

/**
 * @openapi
 * /api/inscripciones/{id}:
 *   delete:
 *     tags:
 *       - Inscripciones
 *     summary: Cancelar inscripción
 *     description: Elimina la inscripción del usuario autenticado (solo su propia inscripción).
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la inscripción a cancelar
 *     responses:
 *       200:
 *         description: Inscripción cancelada
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 ok:
 *                   type: boolean
 *                   example: true
 *                 msg:
 *                   type: string
 *                   example: "Inscripción cancelada"
 *       401:
 *         description: No autorizado
 *       404:
 *         description: Inscripción no encontrada
 */
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const inscripcion = await Inscripcion.findOneAndDelete({
      _id: req.params.id,
      usuario: req.usuario._id
    });
    
    if (!inscripcion) {
      return res.status(404).json({
        ok: false,
        msg: 'Inscripción no encontrada'
      });
    }
    
    res.json({
      ok: true,
      msg: 'Inscripción cancelada'
    });
    
  } catch (error) {
    res.status(500).json({
      ok: false,
      msg: 'Error al cancelar'
    });
  }
});

module.exports = router;