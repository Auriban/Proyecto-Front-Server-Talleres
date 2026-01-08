/**
 * Importamos el modelo "Taller".
 * Este modelo es el que nos permite crear, buscar, editar o borrar Talleres
 * dentro de la base de datos.
 */
const Taller = require('../models/taller.model');

/**
 * Crea un nuevo taller en la base de datos.
 * Esta función recibe los datos desde el body de la petición (req.body).
 * - Intenta guardar el nuevo taller.
 * - Si todo va bien, devuelve un estado 201 (creado) y la información guardada.
 * - Si algo falla, devuelve un error 500.
 * @param {Object} req - La petición con datos en req.body y archivo en req.file
 * @param {Object} res - La respuesta HTTP
 */
const createTaller = async (req, res) =>{
    try {
    // console.log('BODY:', req.body);     
    // console.log('FILE:', req.file);     
    
    const datos = req.body;              

    /**
    * Si hay archivo subido, le pone la ruta de la imagen  
    */
    if (req.file) {
      datos.imgTaller = `/uploads/talleres/${req.file.filename}`;
    }

    /** 
     * Crea el taller nuevo y lo guarda en la base de datos 
    */
    const taller = new Taller(datos);       
    await taller.save();
    
    /** 
     * Todo bien, devuelve el taller creado 
     * */
    res.status(201).json({ 
        msg: 'Taller creado', taller 
    });
  } catch (error) {
    // console.log('ERROR:', error);

    /** 
    * Algo salió mal, devuelve el error 
    */
    res.status(500).json({ 
        error: error.message 
    });
  }
};

/**
 * Obtiene todos los talleres almacenados.
 * Busca todos en la base de datos y los devuelve.
 * @param {Object} req - La petición HTTP
 * @param {Object} res - La respuesta HTTP
 */
const getAllTalleres = async (req, res) => {
    try {
        /** 
         * Busca todos los talleres 
         * */
        const talleres = await Taller.find();
        /** 
         * Los devuelve organizados
         * */
        res.status(200).json({
            ok:true, 
            msg: 'Talleres obtenidos correctamente',
            data: talleres
        });

    } catch (error) {
        /** 
         * Por si la busqueda falla 
         * */
        res.status(500).json({ 
            ok:false, 
            msg: 'Error al obtener los talleres'
        });
    }
};

/**
 * Obtiene un taller específico por ID.
 * Método: GET /:id
 * @param {Object} req - Petición con ID en req.params.id
 * @param {Object} res - Respuesta HTTP
 * @returns {JSON} El taller o error 404 si no existe
 */
const getTallerPorId = async (req, res) => {
  const { id } = req.params;

 try {
   /** 
    * Busca el taller por su ID 
    */
   const taller = await Taller.findById(id);

   /** 
    * Si no lo encuentra dice que no existe 
    */
   if (!taller) {
     return res.status(404).json({
       ok: false,
       msg: 'Taller no encontrado'
     });
   }

   /** 
    * Lo devuelve todo bien 
    */
   return res.status(200).json({
     ok: true,
     data: taller  
   });
   
 } catch (error) {
   /** 
    * Error raro, devuelve 500 
    */
   return res.status(500).json({
     ok: false,
     msg: 'Error al buscar taller'
   });
 }
};

/**
 * Actualiza un taller usando su ID.
 * Cambia los datos que le manden en el body.
 * @param {Object} req - ID en params, datos nuevos en body
 * @param {Object} res - Respuesta con taller actualizado o error
 */
const updateTaller = async (req, res) => {
  const { id } = req.params;
  
  try {
    /** 
     * Saca los datos nuevos del body 
    */
    const { titulo, descripcion, precio, fecha, categoria } = req.body;
    
    /** 
     * Si hay nueva foto, usa esa. Si no, mantiene la vieja 
    */
    const imgTaller = req.file ? `/uploads/talleres/${req.file.filename}` : req.body.imgTaller;
    
    /** 
     * Busca y actualiza el taller con los datos nuevos 
    */
    const tallerActualizado = await Taller.findByIdAndUpdate(
      id, 
      { titulo, descripcion, precio, fecha, categoria, imgTaller }, 
      { new: true }
    );

    /** 
     * Si no existe
     * */
    if (!tallerActualizado) {
      return res.status(404).json({
        ok: false,
        msg: 'Taller no encontrado'
      });
    }

    /**
     * Devuelve el taller actualizado 
     * */
    return res.status(200).json({
      ok: true,
      msg: 'Taller actualizado correctamente',
      data: tallerActualizado
    });

  } catch (error) {
    /** 
     * Error al actualizar 
     * */
    console.error('Error al actualizar el taller:', error);
    return res.status(500).json({
      ok: false,
      msg: 'Error al actualizar el taller'
    });
  }
};

/**
 * Elimina un taller por su ID.
 * Lo busca y si existe, lo borra de la base de datos.
 * @param {Object} req - ID en req.params.id
 * @param {Object} res - Confirmación de borrado o error
 */
const deleteTaller = async (req, res) => {
    /** 
     * Saca el ID de los parámetros 
     * */
    const { id } = req.params;

    try {
        /** 
         * Busca y borra el taller 
         * */
        const eliminartaller = await Taller.findByIdAndDelete(id);

        /** 
         * Por si no existe 
         * */
        if (!eliminartaller) {
            return res.status(404).json({
                ok: false,
                msg: 'Taller no encontrado'
            });
        }

        /** 
         * Confirmación de borrado 
         * */
        return res.status(200).json({
            ok: true,
            msg: 'Taller eliminado correctamente',
            data: eliminartaller
        });
        
    } catch (error) {
        /** 
         * Error inesperado 
         * */
        return res.status(500).json({
            ok: false,
            msg: 'Error al eliminar'
        });
    }
};

module.exports = {
    createTaller,
    getAllTalleres,
    getTallerPorId,
    updateTaller,
    deleteTaller
};
