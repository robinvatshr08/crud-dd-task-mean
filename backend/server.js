require('dotenv').config(); // Load .env file
const express = require('express');
const mongoose = require('mongoose');
// const cors = require('cors'); // uncomment if you need CORS

const app = express();

// Middleware
app.use(express.json()); // parse application/json
app.use(express.urlencoded({ extended: true })); // parse application/x-www-form-urlencoded
// app.use(cors()); // uncomment if needed

// MongoDB connection
const uri = process.env.MONGO_URI;

mongoose.set('strictQuery', false); // optional to suppress Mongoose deprecation warning

mongoose
  .connect(uri)
  .then(() => {
    console.log('Connected to the database!');
  })
  .catch(err => {
    console.error('Cannot connect to the database!', err);
    process.exit(1); // Exit process if DB connection fails
  });

// Simple route
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to Test application.' });
});

// Load other routes
require('./app/routes/turorial.routes')(app); // make sure this path is correct

// Start server
const PORT = process.env.BACKEND_PORT || 8080; // Use BACKEND_PORT from .env
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});
