const express = require("express");
const router = express.Router();
const Cats = require("../controllers/CatController");

// Upload Cats
router.post("/upload", Cats.upload);
router.get('/list', Cats.list);
router.delete('/:id', Cats.delete);
router.put('/:id', Cats.update);

module.exports = router;