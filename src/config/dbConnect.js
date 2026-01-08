/**
 * Esta función conecta la aplicación con MongoDB
 * @returns {Promise} La respuesta de la conexión (o el error)
 */
const mongoose = require('mongoose');


const uri = process.env.DB_URI;


/**
 * Esta función maneja la conexión con MongoDB
 * @async
 */
const connection =  async () =>{


    try {
        /** 
         * Se conecta usando la URI del .env 
        */
        const response = await mongoose.connect(process.env.DB_URI);
        /** 
         * Confirma la conexión exitosa 
        */
        console.log('Conectado a la BBDD');


        return response;
        
    } catch (error) {
        /** 
         * Muestra el error en consola 
        */
        console.log(error)


        /** 
         * Lanza error personalizado 
        */
        throw {
            ok: false,
            msg: "Error al conectar con la BBDD"
        };
    }
}



module.exports = {connection};
