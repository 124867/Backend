/* GET /cats: Returns all cats in the array.
POST /cats: Adds a new cat to the array.
PUT /cats/:id: Updates an existing cat in the array by its id.
DELETE /cats/:id: Removes an existing cat from the array by its id. */

const express = require('express');
const router = express.Router();
const Cat = require('../model/catsModel');

router.get('/', (req, res) => {
  Cat.find({}, (err, cats) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.json(cats);
    }
  });
});

router.post('/', (req, res) => {
  const { name, age, breed } = req.body;
  const cat = new Cat({ name, age, breed });
  cat.save(err => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.send('Cat added successfully.');
    }
  });
});

router.put('/:id', (req, res) => {
  const id = req.params.id;
  const { name, age, breed } = req.body;
  Cat.findByIdAndUpdate(id, { name, age, breed }, err => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.send('Cat updated successfully.');
    }
  });
});

router.delete('/:id', (req, res) => {
  const id = req.params.id;
  Cat.findByIdAndDelete(id, err => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.send('Cat removed successfully.');
    }
  });
});

module.exports = router;