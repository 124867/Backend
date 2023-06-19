const express = require('express');
const cors = require('cors');
const catRoute = require('../route/CatRoute');
const userRoute = require('../route/userRoute');
const db = require('./util/db');

// Create a new Express app
const app = express();

// Set up middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('test'));

// Set up routes
app.use('/cats', catRoute);
app.use('/User', userRoute);

// Start the server
const port = process.env.PORT || 4000;
app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});

module.exports = app;