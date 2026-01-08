/**
 * Importamos Schema y model de mongoose, y bcrypt para contraseñas
 */
const { Schema, model } = require('mongoose');
const bcrypt = require('bcryptjs');

/**
 * Esquema para los usuarios de la aplicación
 * 
 * Define la estructura de cada usuario en la base de datos
 * Incluye validaciones para email único y campos obligatorios
 */
const UserSchema = new Schema({
  /** 
   * Nombre completo del usuario obligatorio 
   * */
  name: { 
    type: String, 
    required: true 
  },

  /** 
   * Email del usuario único y obligatorio 
   * */
  email: { 
    type: String, 
    unique: true, 
    required: true 
  },

  /** 
   * Contraseña encriptada obligatoria 
   * */
  password: { 
    type: String, 
    required: true 
  },

  /**
   *  Rol del usuario por defecto 'user' 
   * */
  role: { 
    type: String, 
    required: true, 
    default: 'user' 
  }
});

/**
 * Método para comparar contraseñas
 * 
 * Se usa al hacer login para verificar que la contraseña sea correcta
 * Recibe la contraseña en texto y la compara con la encriptada
 * 
 * @param {string} plainPassword - Contraseña que escribe el usuario
 * @returns {Promise<boolean>} true si coincide, false si no
 */
UserSchema.methods.comparePassword = function(plainPassword) {
  return bcrypt.compare(plainPassword, this.password);
};

/**
 * Crea y exporta el modelo User
 * Se guardará como colección "users" en MongoDB
 */
module.exports = model('User', UserSchema);
