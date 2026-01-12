/**
 * Importamos todo lo necesario para las rutas de contenido HOME
 */
const express = require('express');
const multer = require('multer');
const path = require('path');
const HomeContent = require('../models/home.model'); 
const { authMiddleware, esAdmin } = require('../middleware/auth');

const router = express.Router();

/**
 * Configuración de multer específicamente para imágenes de la home
 * 
 * Guarda en carpeta public/uploads/home/
 * Nombres únicos con timestamp + extensión original
 * Solo permite imágenes, máximo 5MB
 */
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'public/uploads/home/'),
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname))
});

const upload = multer({ 
  storage, 
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => file.mimetype.startsWith('image/') ? cb(null, true) : cb(new Error('Solo imágenes'), false)
});

/**
 * GET /home/public - Público
 * 
 * Obtiene el contenido más reciente de la home
 * Cualquier usuario puede acceder (sin login)
 * Devuelve el último registro o objeto vacío
 */
router.get('/public', async (req, res) => {
  try {
    /** 
     * Busca el contenido más reciente de la home 
     * */
    const content = await HomeContent.findOne().sort({ createdAt: -1 });
    res.json({
      ok: true,
      data: content || {}
    });
  } catch (error) {
    /** 
     * Error al cargar contenido 
     * */
    res.status(500).json({ 
      ok: false, 
      msg: 'Error cargando home' 
    });
  }
});

/**
 * PUT /home/ - Solo ADMIN
 * 
 * Actualiza TODO el contenido de la home 
 * Logueado + ser admin
 * Acepta múltiples archivos con upload.fields()
 * 
 * Si existe contenido anterior, lo actualiza
 * Si no existe, crea uno nuevo
 */
router.put('/', [
  authMiddleware,  // Verifica token
  esAdmin,         // Verifica rol admin
  upload.fields([
    { name: 'portada', maxCount: 1 },
    { name: 'card1_imagen', maxCount: 1 },
    { name: 'card2_imagen', maxCount: 1 },
    { name: 'card3_imagen', maxCount: 1 }
  ])
], async (req, res) => {
  try {
    /** 
     * Extrae textos del body 
     * */
    const { titulo, card1_titulo, card2_titulo, card3_titulo } = req.body;

    /** 
     * Procesa imágenes subidas (o mantiene las anteriores) 
     * */
    const portada = req.files['portada']?.[0] ? `/uploads/home/${req.files['portada'][0].filename}` : null;
    const card1_imagen = req.files['card1_imagen']?.[0] ? `/uploads/home/${req.files['card1_imagen'][0].filename}` : null;
    const card2_imagen = req.files['card2_imagen']?.[0] ? `/uploads/home/${req.files['card2_imagen'][0].filename}` : null;
    const card3_imagen = req.files['card3_imagen']?.[0] ? `/uploads/home/${req.files['card3_imagen'][0].filename}` : null;

    /**
     *  Busca contenido existente 
     * */
    let content = await HomeContent.findOne().sort({ createdAt: -1 });
    
    if (content) {
      /** 
       * ACTUALIZA contenido existente 
       * */
      content = await HomeContent.findByIdAndUpdate(
        content._id,
        { 
          titulo: titulo || content.titulo,
          portada: portada || content.portada,
          card1_titulo: card1_titulo || content.card1_titulo,
          card1_imagen: card1_imagen || content.card1_imagen,
          card2_titulo: card2_titulo || content.card2_titulo,
          card2_imagen: card2_imagen || content.card2_imagen,
          card3_titulo: card3_titulo || content.card3_titulo,
          card3_imagen: card3_imagen || content.card3_imagen
        },
        { new: true }
      );
    } else {
      /** 
       * CREA contenido nuevo 
       * */
      content = await HomeContent.create({ 
        titulo, portada, card1_titulo, card1_imagen, 
        card2_titulo, card2_imagen, card3_titulo, card3_imagen 
      });
    }
    
    /** 
     * Devuelve contenido actualizado 
     * */
    res.json({ ok: true, content });
  } catch (error) {
    console.error('Error:', error);
    
    res.status(500).json({ 
      ok: false, 
      msg: error.message 
    });
  }
});

module.exports = router;
