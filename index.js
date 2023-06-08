const express = require('express');
const mongoose = require('mongoose');
const app = express();

const authController = require('./controllers/authController');
const protectedController = require('./controllers/protectedController');
const catsController = require('./controllers/CatController');

const url = "mongodb+srv://LOl:n20WKfhzy3jH2YHc@cluster0.8lnqldf.mongodb.net/?retryWrites=true&w=majority"

mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to database'))
  .catch(err => console.error(err));

app.use(express.json());
app.use('/auth', authController);
app.use('/', protectedController);
app.use('/cats', catsController);

app.listen(3000, () => {
  console.log('Server started on port 3000');
});