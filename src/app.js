const express = require('express');
const cors = require('cors');
const session = require('express-session');
const { MongoStore } = require('connect-mongo');
const passport = require('passport');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('../swagger.json');
const routes = require('./routes');

require('./config/passport')(passport);

const app = express();

// Render serves the app behind a proxy; needed for secure cookies
app.set('trust proxy', 1);

// Global Middlewares
app.use(cors());
app.use(express.json());

// Sessions (stored in MongoDB) and OAuth
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({ mongoUrl: process.env.MONGODB_URI }),
    cookie: {
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      maxAge: 1000 * 60 * 60 * 24
    }
  })
);
app.use(passport.initialize());
app.use(passport.session());

// Swagger API Documentation Route
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// API Routes
app.use('/', routes);

// Centralized Error Handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    error: {
      message: err.message || 'Internal Server Error'
    }
  });
});

module.exports = app;
