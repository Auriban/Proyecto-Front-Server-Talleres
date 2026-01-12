/**
 * Importamos Schema y model de mongoose para crear el modelo Taller
 */
const {Schema, model} = require ('mongoose');

/**
 * Esquema para los talleres
 * 
 * Define todos los campos obligatorios que debe tener cada taller
 * Incluye validaciones como precio mínimo 0 y limpieza de espacios
 */
const TallerSchema = new Schema({
    /** 
     * Título del taller único y obligatorio 
     * */
    titulo: {
      type: String,
      required: true,
      unique: true,  
      trim: true
    },
    /** 
     * Descripción del taller obligatoria 
     * */
    descripcion: {
      type: String,
      required: true
    },
    /** 
     * Precio del taller número positivo obligatorio 
     * */
    precio: {
      type: Number,
      required: true,
      min: 0
    },
    /** 
     * Fecha del taller obligatoria 
     * */
    fecha: {
      type: Date,
      required: true
    },
    /** 
     * Categoría del taller  obligatoria 
     * */
    categoria: {
      type: String,
      required: true,
      trim: true
    },
    /** 
     * Ruta de la imagen del taller obligatoria 
     * */
    imgTaller: {
      type: String,
      required: true
    },
})

/**
 * Crea y exporta el modelo Taller
 */
module.exports = model ('Taller', TallerSchema)
