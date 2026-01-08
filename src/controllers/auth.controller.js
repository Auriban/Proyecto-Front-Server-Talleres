const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/user.nodel');

const JWT_SECRET = process.env.JWT_SECRET;

/**
 * REGISTRO - Crea un nuevo usuario
 */
const register = async (req, res) => {
  try {
    const { email, password, name, role } = req.body;

    const usuarioExiste = await User.findOne({ email });
    if (usuarioExiste) {
      return res.status(400).json({ error: 'Email ya registrado' });
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHashed = await bcrypt.hash(password, salt);

    const usuario = new User({
      email,
      password: passwordHashed,
      name,
      role: role || 'user'
    });

    await usuario.save();

    const token = jwt.sign({ id: usuario._id }, JWT_SECRET, { expiresIn: '24h' });

    res
      .cookie('token', token, { httpOnly: true })
      .json({
        msg: 'Usuario creado',
        usuario: { id: usuario._id, email, name, role: usuario.role }
      });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * LOGIN - Inicia sesión y devuelve token
 */
const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const usuario = await User.findOne({ email });

    if (!usuario || !await bcrypt.compare(password, usuario.password)) {
      return res.status(401).json({ error: 'Email o contraseña inválidas' });
    }

    const token = jwt.sign(
      { id: usuario._id, role: usuario.role },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      token,
      usuario: {
        _id: usuario._id,
        name: usuario.name,
        email: usuario.email,
        role: usuario.role
      }
    });
  } catch (error) {
    res.status(500).json({ error: 'Error en login' });
  }
};

/**
 * PERFIL - Devuelve los datos del usuario logueado
 */
const perfil = (req, res) => {
  res.json({ usuario: req.usuario });
};

module.exports = {
  register,
  login,
  perfil
};
