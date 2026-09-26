const express = require('express');
const cors = require('cors');
const routes = require('./routes');

const app = express();

// Global Middlewares
app.use(cors());
app.use(express.json());

// API Routes
app.use('/', routes);

// Centralized Error Handling Middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    error: {
      message: err.message || 'Internal Server Error'
    }
  });
});

module.exports = app;