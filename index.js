/* const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const fileUpload = require("express-fileupload");


const authController = require('./controllers/authController');
const protectedController = require('./controllers/protectedController');
const CatsRouter = require("./route/CatRoute");

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static('public'));
app.use(express.static('images'));
app.use('/images', express.static(path.join(__dirname, 'images')));

app.use(fileUpload());

const url = "mongodb+srv://LOl:n20WKfhzy3jH2YHc@cluster0.8lnqldf.mongodb.net/?retryWrites=true&w=majority"

mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to database'))
  .catch(err => console.error(err));

app.use('/auth', authController);
app.use('/', protectedController);
app.use("/cats", CatsRouter);



app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});





app.listen(3000, () => {
  console.log('Server started on port 3000');
}); */
const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const fileUpload = require("express-fileupload");

const authController = require('./controllers/authController');
const userController = require('./controllers/userController');
const charityWorkerController = require('./controllers/charityWorkerController');
const CatsRouter = require("./route/CatRoute");

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static('public'));
app.use(express.static('images'));
app.use('/images', express.static(path.join(__dirname, 'images')));
app.use(fileUpload());

const url = "mongodb+srv://LOl:n20WKfhzy3jH2YHc@cluster0.8lnqldf.mongodb.net/?retryWrites=true&w=majority"

mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to database'))
  .catch(err => console.error(err));

app.use('/auth', authController);

// User routes
app.get('/user/login', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'login.html'));
});
app.use('/user', userController);

// Charity worker routes
app.get('/charity-worker/login', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'login.html'));
});
app.use('/charity-worker', charityWorkerController);

app.use("/cats", CatsRouter);

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(3000, () => {
  console.log('Server started on port 3000');
});