/**
 * Importamos JWT para verificar tokens y el modelo User
 */
const jwt = require('jsonwebtoken');
const User = require('../models/user.nodel'); 

const JWT_SECRET = process.env.JWT_SECRET;

/**
 * Middleware de autenticación - Verifica que el usuario tenga token válido
 * 
 * Primero busca el token en cookies o en el header Authorization
 * Luego verifica que el token sea válido con JWT_SECRET
 * Y busca el usuario en la base de datos y lo añade a req.usuario
 * 
 * @param {Object} req - La petición HTTP 
 * @param {Object} res - La respuesta HTTP
 * @param {Function} next - Siguiente middleware si todo bien
 */
const authMiddleware = async (req, res, next) => {
  try {
    //console.log('TOKEN recibido:', req.cookies.token ? 'SÍ' : 'NO'); 
    /** 
     * Busca token en cookies o en header Authorization 
     * */
    const token = req.cookies.token || req.header('Authorization')?.replace('Bearer ', '')
    
    /** Si no hay token, devuelve error 401 */
    if (!token) {
      return res.status(401).json({ 
        error: 'Token requerido' 
      });
    }
    // console.log(' Verificando JWT', JWT_SECRET); 

    /** 
     * Verifica el token y decodifica los datos del usuario 
     * */
    const decoded = jwt.verify(token, JWT_SECRET);
    /** 
     * Busca un usuario en la base de datos usando su ID, espera la respuesta y guarda sus datos sin la contraseña.
     * */
    const usuario = await User.findById(decoded.id).select('-password');
    
    /** 
     * Si no encuentra el usuario error 401
     *  */
    if (!usuario) {
      return res.status(401).json({ 
        error: 'Usuario no encontrado' 
      });
    }

    /** 
     * Añade el usuario a la petición para usarlo después 
     * */
    req.usuario = usuario;
    next();
  } catch (error) {
    /** 
     * Token inválido 
     * */
    res.status(401).json({ 
      error: 'Token inválido' 
    });
  }
};

/**
 * Middleware para verificar que el usuario sea ADMIN
 * 
 * Comprueba que req.usuario.role sea 'admin'
 * Si no es admin, devuelve error 403 (prohibido)
 * 
 * @param {Object} req - Debe tener req.usuario del middleware anterior
 * @param {Object} res - Respuesta HTTP
 * @param {Function} next - Continúa si es admin
 */
const esAdmin = (req, res, next) => {
  /** 
   * Verifica que el usuario sea admin 
   * */
  if (req.usuario.role !== 'admin') {
    return res.status(403).json({ error: 'Requiere rol ADMIN' });
  }
  next();
};

module.exports = { authMiddleware, esAdmin };
