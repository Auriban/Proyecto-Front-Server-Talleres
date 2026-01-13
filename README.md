# API REST de Talleres (Node.js + Express)

## Descripción

Este repositorio contiene el **backend** de la aplicación de talleres.
Es una **API REST** desarrollada con **Node.js y Express**, conectada a **MongoDB** mediante **Mongoose**.

La API permite:

* Gestión de usuarios y roles
* Autenticación con JWT
* CRUD de talleres
* Inscripciones a talleres
* Subida y gestión de imágenes
* Documentación automática con Swagger

La documentación de la API está disponible en:

```
/api/docs
```

---

## Tecnologías y dependencias

* **Node.js + Express** — servidor y API REST
* **MongoDB + Mongoose** — base de datos
* **dotenv** — variables de entorno
* **bcryptjs** — hash de contraseñas
* **jsonwebtoken** — autenticación JWT
* **express-validator** — validación de datos
* **cors** y **cookie-parser** — manejo de peticiones
* **multer** — subida de archivos
* **swagger-jsdoc** + **swagger-ui-express** — documentación
* **nodemon** — entorno de desarrollo
* **npm** — gestor de dependencias

---

## Variables de entorno

Crea un archivo `.env` en la raíz del proyecto.
Las variables mínimas requeridas son:

```env
PORT=3000
DB_URI=mongodb://localhost:27017/talleres
JWT_SECRET=tu_clave_secreta
```

La conexión a la base de datos se configura mediante `process.env.DB_URI`.
Archivo relacionado: `src/config/dbConnect.js`.

---

## Estructura del proyecto

```text
├── src/
│   ├── app.js            # Entrada principal
│   ├── config/           # Configuración (DB, etc.)
│   ├── routes/           # Rutas de la API
│   ├── controllers/      # Lógica de negocio
│   ├── models/           # Modelos de Mongoose
│   └── middlewares/      # Auth, validaciones, uploads
├── public/               # Archivos estáticos
├── uploads/              # Archivos subidos
├── .env                  # Variables de entorno (no commitear)
├── package.json
└── README.md
```

---

## Modelos principales

* **Usuario** — usuarios y roles (`admin`, `user`)
* **Taller** — datos del taller (título, descripción, fecha, imagen, etc.)
* **Inscripción** — relación entre usuarios y talleres

---

## Seguridad y validaciones

* Autenticación con **JWT**
* Rutas protegidas mediante middleware
* Control de roles (solo administradores)
* Validación de datos con **express-validator**
* Middlewares para autenticación, permisos y subida de archivos

---

## Rutas principales

Todas las rutas están montadas bajo `/api`.

### Autenticación (`/api/auth`)

* `POST /api/auth/signup` — Registro de usuario
* `POST /api/auth/login` — Inicio de sesión
* `GET /api/auth/renovar` — Renovar token 

### Usuarios (`/api/usuarios`)

* `POST /api/usuarios/crear` — Crear usuario (admin)
* `GET /api/usuarios/obtener/:id` — Obtener usuario por ID
* `PUT /api/usuarios/editar/:id` — Editar usuario (admin)
* `DELETE /api/usuarios/eliminar/:id` — Eliminar usuario (admin)

### Talleres (`/api/talleres`)

* `GET /api/talleres` — Listar talleres
* `GET /api/talleres/:id` — Obtener taller
* `POST /api/talleres` — Crear taller (admin)
* `PUT /api/talleres/:id` — Editar taller (admin)
* `DELETE /api/talleres/:id` — Eliminar taller (admin)
* `POST /api/talleres/buscar` — Buscar talleres

### Inscripciones (`/api/inscripciones`)

* `POST /api/inscripciones` — Inscribirse a un taller
* `GET /api/inscripciones/user/:id` — Inscripciones del usuario
* `DELETE /api/inscripciones/:id` — Anular inscripción

### Otros

* `/api/home` — datos públicos
* `/api/docs` — documentación Swagger

---

## Subida de imágenes

* `POST /api/uploads` — Subir una imagen (`imagen`)
* `POST /api/uploads/multiple` — Subir múltiples imágenes (`imagenes`)
* `GET /api/uploads` — Listar archivos
* `DELETE /api/uploads/:filename` — Eliminar archivo

**Notas:**

* Se utiliza **Multer** para manejar uploads
* Los archivos se almacenan en `uploads/`
* Se sirven como estáticos desde `public/uploads`
* Solo usuarios con rol **admin** pueden subir imágenes asociadas a recursos

---

## Scripts disponibles (npm)

* `npm run dev` — desarrollo con nodemon
* `npm start` — ejecución en producción

---

## Ejecución local

1. Clonar el repositorio:

   ```bash
   git clone https://github.com/Auriban/Proyecto-Front-Server-Talleres.git
   cd Proyecto-Front-Server-Talleres
   ```

2. Instalar dependencias:

   ```bash
   npm install
   ```

3. Crear archivo `.env`:

   ```env
   PORT=3000
   DB_URI=mongodb://localhost:27017/talleres
   JWT_SECRET=tu_clave_secreta
   ```

4. Crear carpeta de uploads:

   ```bash
   mkdir uploads
   ```

5. Ejecutar:

   ```bash
   npm run dev    # desarrollo
   npm start      # producción
   ```

6. Acceder:

   * API: [http://localhost:3000](http://localhost:3000)
   * Swagger: [http://localhost:3000/api/docs](http://localhost:3000/api/docs)

---

## Despliegue

El backend y la base de datos están desplegados en **Render**.
Configurar las variables de entorno en el entorno de producción.

