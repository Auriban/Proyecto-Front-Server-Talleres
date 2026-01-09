const express = require('express');
const { authMiddleware } = require('../middleware/auth');
const Taller = require('../models/taller.model'); 
const Inscripcion = require('../models/inscripcion.model');

const router = express.Router();

/**
 * POST /api/inscripciones
 * Inscribe usuario a un taller
 * Requiere estar logueado
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
 * GET /api/inscripciones
 * Obtiene mis inscripciones
 * Requiere estar logueado
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
 * DELETE /api/inscripciones/:id
 * Cancela inscripción
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
