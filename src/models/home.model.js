/**
 * Importamos Schema y model de mongoose para crear el modelo de HomeContent
 */
const { Schema, model } = require('mongoose');

/**
 * Esquema para el contenido de la página principal (home)
 * 
 * Define la estructura de datos que se guardará en MongoDB para la home
 * Campos obligatorios y opcionales para mostrar contenido en la página principal
 */
const homeContentSchema = new Schema({
  /** 
   * Título principal de la home (obligatorio) 
   * */
  titulo: { 
    type: String, 
    required: true 
  },
  
  /** 
   * Imagen de portada 
   * */
  portada: String,
  
  /** 
   * Título de la primera tarjeta 
   * */
  card1_titulo: String,
  /** 
   * Imagen de la primera tarjeta 
   * */
  card1_imagen: String,
  
  /** 
   * Título de la segunda tarjeta 
   * */
  card2_titulo: String,
  /** 
   * Imagen de la segunda tarjeta 
   * */
  card2_imagen: String,
  
  /** 
   * Título de la tercera tarjeta 
   * */
  card3_titulo: String,
  /** 
   * Imagen de la tercera tarjeta 
   * */
  card3_imagen: String
}, { 
  /** 
   * Añade automáticamente fecha de creación y actualización 
   * */
  timestamps: true 
});

/**
 * Crea y exporta el modelo para usar en controladores
 */
module.exports = model('HomeContent', homeContentSchema);
