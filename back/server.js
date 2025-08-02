const express = require('express');
const cors = require('cors');
const fileUpload = require('express-fileupload');
const connectDB = require('./config/db');
require('dotenv').config();

const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json()); // Parse JSON bodies
app.use(fileUpload());

// Test route
app.get('/', (req, res) => {
  res.send('Bill Payment Backend Running');
});


// Routes will go here (e.g., app.use('/api/auth', require('./routes/auth')))
const routes = require('./routes/index');
app.use('/api', routes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));