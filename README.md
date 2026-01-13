# Proyecto Front + Server — Talleres

Qué es
------
Este repositorio contiene el servidor (y el front si lo añadís) para gestionar talleres: crear, listar, editar y borrar talleres. También tiene manejo de usuarios, autenticación y subida de imágenes.

Resumen rápido
--------------
- Backend: Node.js con Express.
- Base de datos: MongoDB via Mongoose.
- Vistas/plantillas: EJS (si usás render desde el servidor).
- Autenticación: JWT.
- Passwords: bcryptjs.
- Subida de archivos: multer.
- Docs API: Swagger (swagger-jsdoc + swagger-ui-express).
- Mensajes en cliente: SweetAlert2.

Requisitos
---------
- Node.js (recomiendo v14+)
- npm (o yarn)
- MongoDB (local o en la nube)

Instalación y ejecución
-----------------------
1. Clona el repo:
   - git clone https://github.com/Auriban/Proyecto-Front-Server-Talleres.git
   - cd Proyecto-Front-Server-Talleres

2. Instala dependencias:
   - npm install

3. Variables de entorno
   - Crea un archivo `.env` en la raíz del proyecto con al menos:
     - PORT=3000
     - DB_URI=mongodb://localhost:27017/talleres   (o la URL de tu MongoDB)
     - JWT_SECRET=tu_clave_secreta
   - Nota: en el código se usa `process.env.DB_URI` para la conexión a la BBDD.

4. Ejecutar en desarrollo:
   - npm run dev
   - Esto usa `nodemon src/app.js`.

5. Ejecutar en producción:
   - npm start
   - Esto ejecuta `node src/app.js`.

Scripts (tal como están en package.json)
---------------------------------------
- npm run dev  — arranca con nodemon (`nodemon src/app.js`)
- npm start    — arranca con node (`node src/app.js`)
- npm test     — script por defecto (no hay tests configurados)

Puntos importantes del servidor
-------------------------------
- Archivo principal: `src/app.js`
  - Monta rutas:
    - `/api/auth`       -> auth.routes.js
    - `/api/talleres`   -> taller.routes.js
    - `/api/usuarios`   -> user.routes.js
    - `/api/home`       -> home.routes.js
    - `/api/inscripciones` -> inscripcion.routes.js
  - Sirve archivos subidos en `/uploads` y `public/uploads`.
  - Documentación Swagger en `/api/docs`.
  - Conecta a la BBDD usando `src/config/dbConnect.js` (usa `process.env.DB_URI`).

Estructura relevante 
---------------------------------------------
- src/
  - app.js
  - api-docs.js
  - config/
    - dbConnect.js
  - routes/
    - auth.routes.js
    - taller.routes.js
    - user.routes.js
    - home.routes.js
    - inscripcion.routes.js
  - controllers/        (lógica de negocio)
  - models/
    - taller.model.js
    - home.model.js
    - user.nodel.js     <- atención: el archivo de usuario tiene un nombre con typo (`user.nodel.js`)
    - inscripcion.model.js
  - middleware/
    - (middleware para auth, uploads, validaciones, etc.)
- public/                (estáticos)
- uploads/               (imágenes subidas)

Dependencias principales (según package.json)
---------------------------------------------
- express
- mongoose
- dotenv
- ejs
- jsonwebtoken
- bcryptjs
- multer
- swagger-jsdoc
- swagger-ui-express
- cookie-parser
- cors
- express-validator
- sweetalert2

Rutas principales y cómo usarlas
-------------------------------
(estas rutas vienen de los archivos en `src/routes`)

Auth
- POST /api/auth/register — registrar usuario
  - Body: { name, email, password, role }
- POST /api/auth/login — login
  - Body: { email, password }
- GET  /api/auth/perfil — obtener perfil (requiere token)

Usuarios (solo admin)
- GET  /api/usuarios/ — listar todos los usuarios (admin)
- POST /api/usuarios/ — crear usuario (admin)

Talleres
- GET  /api/talleres/ — listar todos los talleres (público)
- GET  /api/talleres/:id — obtener taller por id (público)
- POST /api/talleres/creartaller — crear taller (admin, admite imagen multipart)
- PUT  /api/talleres/:id — editar taller (admin)
- DELETE /api/talleres/:id — borrar taller (admin)

Home
- GET  /api/home/public — obtener contenido público de la home
- PUT  /api/home/ — actualizar contenido de la home (admin, admite varios archivos)

Inscripciones
- POST /api/inscripciones/ — inscribir usuario a taller (requiere token)
- GET  /api/inscripciones/ — (devuelve inscripciones del usuario autenticado)

Subidas y archivos
------------------
- Las imágenes se guardan en carpetas dentro de `public/uploads` o `uploads`.
- En `src/app.js` están servidas en `/uploads` para que el front pueda mostrarlas.

Usuarios por defecto (ejemplo para pruebas)
-------------------------------------------
No hay seeds por defecto en el repo, pero podés crear estos usuarios manualmente:
- Admin:
  - Email: admin@talleres.com
  - Password: admin123
  - Rol: admin
- Usuario demo:
  - Email: a1@gmail.com
  - Password: admin123
  - Rol: user

