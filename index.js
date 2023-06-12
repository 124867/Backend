const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const fileUpload = require("express-fileupload");

const CatsRouter = require("./route/CatRoute");
const userRoute = require('./route/userRoute');
const workerRoute = require('./route/workerRoute');
/* const homeRoute = require('./route/homeRoute'); */

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

app.use('/user', userRoute);

app.use('/charity-worker', workerRoute);

app.use("/cats", CatsRouter);

app.get('/cats', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'cat.html'));
});


app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(3000, () => {
  console.log('Server started on port 3000');
});