const { Schema, model } = require('mongoose');

const InscripcionSchema = new Schema({
  usuario: { 
    type: Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
},
  taller: { 
    type: Schema.Types.ObjectId, 
    ref: 'Taller', 
    required: true 
},
fechaInscripcion: { 
    type: Date, 
    default: Date.now 
}
});

module.exports = model('Inscripcion', InscripcionSchema);
