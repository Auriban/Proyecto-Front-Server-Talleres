const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API Talleres',
      version: '1.0.0',
      description: 'Documentación completa de talleres, usuarios y home'
    },
    servers: [{ 
      url: 'http://localhost:3000/api' 
    }]
  },
  // 🔧 BUSCA EN TU CARPETA src/routes/
  apis: ['./src/routes/*.js']
};

const specs = swaggerJsdoc(options);
module.exports = specs;
