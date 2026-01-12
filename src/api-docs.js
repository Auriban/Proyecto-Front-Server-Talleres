const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API Talleres',
      version: '1.0.0',
      description: 'Documentación completa de talleres, usuarios, inscripciones'
    },
    servers: [{ 
      url: 'http://localhost:3000', 
      description: 'Servidor local'
    }],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        }
      },
    },
    security: [{ bearerAuth: [] }]
  },
  apis: ['./src/routes/*.js'] 
};

const specs = swaggerJsdoc(options);
module.exports = specs;