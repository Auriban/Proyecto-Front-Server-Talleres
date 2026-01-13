/**
 * Arrranca toda la aplicación
 */
const express = require('express');
const cors = require('cors')
const cookieParser = require('cookie-parser')
const swaggerUi = require('swagger-ui-express');
const swaggerSpecs = require('./api-docs');
require ('dotenv') .config();

const { connection } = require ('./config/dbConnect');
const homeRoutes = require('./routes/home.routes');
const tallerRoutes = require ('./routes/taller.routes');
const authRoutes = require('./routes/auth.routes');
const usuariosRoutes = require('./routes/user.routes');
const inscripcionRoutes = require('./routes/inscripcion.routes');


const app = express();
const port = process.env.PORT || 3000;

/**
 * MIDDLEWARES - Se ejecutan en TODAS las peticiones
 */

/** 
 * Permite leer JSON en las peticiones POST/PUT 
 * */
app.use(express.json());

/** 
 * CORS - Permite que React hable con el backend 
 * - Si usa cookies desde otro origen, necesita credentials: true y origin concreto
 * */
const corsOptions = {
  origin: process.env.CLIENT_ORIGIN || 'http://localhost:5173', // cambia por el puerto de front
  credentials: true
};
app.use(cors(corsOptions));  // Permite el origen configurado y credenciales

/** 
 * Lee cookies (para el token de autenticación)
 *  */
app.use(cookieParser());

/**
 * RUTAS - Conectamos todas las rutas de la API
 */
app.use('/api/auth', authRoutes);
app.use('/api/talleres', tallerRoutes);
app.use('/api/usuarios', usuariosRoutes);
app.use('/api/home', homeRoutes);
app.use('/api/inscripciones',inscripcionRoutes);

/**
 * ARCHIVOS ESTÁTICOS - Sirve las imágenes subidas
 */
app.use('/uploads', express.static('uploads'));
app.use('/uploads', express.static('public/uploads'));

/**
 * DOCUMENTACION SWAGGER
 */

app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpecs));

/**
 * ARRANCAR SERVIDOR
 * 
 * Escucha en el puerto y conecta a MongoDB
 */
app.listen(port, () => {
    console.log(`Servidor activo en puerto ${port} 🐙`);
    /**
     *  Conecta a la base de datos 
     * */
    connection();
});