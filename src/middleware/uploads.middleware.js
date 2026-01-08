/**
 * Importamos multer para subir archivos y path para manejar nombres de archivos
 */
const multer = require('multer');
const path = require('path');

/**
 * Configuración de dónde y cómo guardar los archivos subidos
 * 
 * Decide la carpeta donde guardar y el nombre único para cada archivo
 */
const storage = multer.diskStorage({
  /** 
   * Define dónde guardar los archivos de talleres 
   * */
  destination: (req, file, cb) => {
    cb(null, 'uploads/talleres/');
  },

  /** 
   * Crea nombre único combinando fecha + número aleatorio + extensión original 
   * */
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueName + path.extname(file.originalname));
  }
});

/**
 * Filtro que solo permite subir imágenes
 * 
 * Rechaza cualquier archivo que no empiece por 'image/'
 */
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    /**
     *  Es imagen, la acepta 
     * */
    cb(null, true);
  } else {
    /**
     *  No es imagen, la rechaza con error 
     * */
    cb(new Error('Solo imágenes permitidas'), false);
  }
};

/**
 * Configuración completa de multer para subir imágenes de talleres
 * 
 * Combina almacenamiento, filtro y límite de tamaño (5MB máximo)
 */
const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }
});

module.exports = upload;
