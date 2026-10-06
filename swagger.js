// OpenAPI 3 so `servers` is honored (Swagger 2.0 output ignores it and defaults host to localhost:3000)
const swaggerAutogen = require('swagger-autogen')({ openapi: '3.0.0' });

const doc = {
  info: {
    title: 'Fleet Tracker API',
    description:
      'CSE 341 Project REST API for managing vehicles, users, maintenance logs, and service shops.<br><br>' +
      'POST, PUT and DELETE routes require login. ' +
      '<a href="/auth/google">Log in with Google</a> in this browser tab, ' +
      'then come back here: the session cookie is sent automatically with every request. ' +
      '<a href="/auth/logout">Log out</a>.'
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
    },
    {
      name: 'Service Shops',
      description: 'Endpoints for managing service shops'
    }
  ],
  components: {
    securitySchemes: {
      cookieAuth: {
        type: 'apiKey',
        in: 'cookie',
        name: 'connect.sid',
        description: 'Session cookie set after logging in at /auth/google'
      }
    }
  }
};

const outputFile = './swagger.json';
const endpointsFiles = ['./src/app.js'];

swaggerAutogen(outputFile, endpointsFiles, doc);
