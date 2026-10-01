// OpenAPI 3 so `servers` is honored (Swagger 2.0 output ignores it and defaults host to localhost:3000)
const swaggerAutogen = require('swagger-autogen')({ openapi: '3.0.0' });

const doc = {
  info: {
    title: 'Fleet Tracker API',
    description: 'CSE 341 Project REST API for managing vehicles, users, and maintenance logs'
  },
  // Relative server URL so the docs call whichever host serves them (Render or localhost)
  servers: [{ url: '/' }],
  tags: [
    {
      name: 'Vehicles',
      description: 'Endpoints for managing vehicles'
    },
    {
      name: 'Users',
      description: 'Endpoints for managing users'
    },
    {
      name: 'Maintenance Logs',
      description: 'Endpoints for managing maintenance logs'
    }
  ]
};

const outputFile = './swagger.json';
const endpointsFiles = ['./src/app.js'];

swaggerAutogen(outputFile, endpointsFiles, doc);
