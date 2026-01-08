/**
 * Importamos el modelo Usuario y bcrypt para encriptar contraseñas
 */
const Usuario = require('../models/user.nodel');
const bcrypt = require('bcryptjs');

/**
 * Obtiene todos los usuarios (sin mostrar las contraseñas)
 * 
 * @param {Object} req - La petición HTTP
 * @param {Object} res - La respuesta HTTP
 */
const getUsuarios = async (req, res) => {
  try {
    /** 
     * Busca todos los usuarios pero sin ver la contraseña 
     * */
    const usuarios = await Usuario.find().select('-password');
    /** 
     * Devuelve la lista de usuarios 
     * */
    res.json({ ok: true, data: usuarios });
  } catch (error) {
    /** 
     * Si algo sale mal, devuelve error 500 
     * */
    res.status(500).json({ 
      ok: false, 
      msg: 'Error al obtener usuarios' 
    });
  }
};

/**
 * Crea un nuevo usuario con contraseña encriptada
 * 
 * Primero verifica que el email no exista ya
 * Luego encripta la contraseña con bcrypt
 * Y guarda el usuario en la base de datos
 * 
 * @param {Object} req - Petición con datos en req.body (name, email, password, role)
 * @param {Object} res - Respuesta con el usuario creado (sin contraseña)
 */
const crearUsuario = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    
    // Verificar si ya existe
    const existeEmail = await Usuario.findOne({ email });
    if (existeEmail) {
      return res.status(400).json({ 
        ok: false, 
        msg: 'Email ya registrado' 
      });
    }

    // Encriptar password
    /** 
     * Crea la "sal" para encriptar 
     * */
    const salt = await bcrypt.genSalt(10);
    /**
     *  Encripta la contraseña con la sal 
     * */
    const passwordHash = await bcrypt.hash(password, salt);

    /** 
     * Crea el nuevo usuario con contraseña encriptada 
     * */
    const usuario = new Usuario({
      name,
      email,
      password: passwordHash,
      role: role || 'user'
    });

    /** 
     * Lo guarda en la base de datos 
     * */
    await usuario.save();
    /** 
     * Devuelve el usuario creado (sin mostrar contraseña) 
     * */
    res.status(201).json({ 
      ok: true, 
      msg: 'Usuario creado', 
      data: { name: usuario.name, email: usuario.email, role: usuario.role }
    });

  } catch (error) {
    res.status(500).json({ 
        ok: false, 
        msg: 'Error al crear usuario' 
    });
  }
};

/**
 * Actualiza un usuario existente
 * 
 * Puede cambiar nombre, email, rol y contraseña 
 * Si no envía algún dato, mantiene el anterior
 * 
 * @param {Object} req - ID en req.params.id, datos nuevos en req.body
 * @param {Object} res - Usuario actualizado (sin contraseña)
 */
const actualizarUsuario = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, role, password } = req.body;

    /** 
     * Busca el usuario por ID (sin contraseña) 
     * */
    const usuario = await Usuario.findById(id).select('-password');
    if (!usuario) {
      return res.status(404).json({ 
        ok: false, 
        msg: 'Usuario no encontrado' 
      });
    }

    /** 
     * Actualiza nombre si lo mandan 
     * */
    usuario.name = name || usuario.name;
    /** 
     * Actualiza email si lo mandan 
     * */
    usuario.email = email || usuario.email;
    /** 
     * Actualiza rol si lo mandan 
     * */
    usuario.role = role || usuario.role;

    // Cambiar password si se envía
    if (password) {
      /** Encripta la nueva contraseña */
      const salt = await bcrypt.genSalt(10);
      usuario.password = await bcrypt.hash(password, salt);
    }

    /** 
     * Guarda los cambios 
     * */
    await usuario.save();
    /** 
     * Devuelve usuario actualizado 
     * */
    res.json({ 
      ok: true, 
      msg: 'Usuario actualizado',
      data: { name: usuario.name, email: usuario.email, role: usuario.role }
    });

  } catch (error) {
    res.status(500).json({ ok: false, msg: 'Error al actualizar usuario' });
  }
};

/**
 * Elimina un usuario por su ID
 * 
 * Busca el usuario y lo borra de la base de datos
 * 
 * @param {Object} req - ID del usuario en req.params.id
 * @param {Object} res - Confirmación de eliminación
 */
const eliminarUsuario = async (req, res) => {
  try {
    const { id } = req.params;
    
    /** 
     * Busca y elimina el usuario 
     * */
    const usuario = await Usuario.findByIdAndDelete(id);
    if (!usuario) {
      return res.status(404).json({ 
        ok: false, 
        msg: 'Usuario no encontrado' 
      });
    }

    /** 
     * Confirma que se eliminó 
     * */
    res.json({ 
        ok: true, 
        msg: 'Usuario eliminado correctamente' 
    });
    
  } catch (error) {
    res.status(500).json({ 
        ok: false, 
        msg: 'Error al eliminar usuario' 
    });
  }
};

module.exports = {
  getUsuarios,
  crearUsuario,
  actualizarUsuario,
  eliminarUsuario
};
