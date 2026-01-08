/**
 * Importamos validationResult de express-validator para verificar errores
 */
const {validationResult } = require("express-validator")

/**
 * Middleware que revisa si hay errores en los datos que mandaron
 * 
 * Se ejecuta después de los validadores (isEmail, isLength...)
 * Si hay errores, para todo y devuelve 400
 * Si está todo bien, deja pasar al siguiente 
 * 
 * @param {Object} req - La petición con datos a validar
 * @param {Object} res - La respuesta (devuelve errores si los hay)
 * @param {Function} next - Continúa si no hay errores
 */
const validateInput = (req, res, next) => {
  /** 
   * Revisa si hay errores de validación 
   * */
  const errors = validationResult(req);
  
  /** 
   * Si encontró errores los devuelve y PARA 
   * */
  if (!errors.isEmpty()) {
    return res.status(400).json({
      ok: false,
      errors: errors.array()
    });
  }
  
  /** 
   * Todo bien, sigue al siguiente paso 
   * */
  next();
};

module.exports = validateInput;
