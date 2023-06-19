const { TextEncoder } = require('fast-text-encoding');
const mongoose = require('mongoose');

const catSchema = new mongoose.Schema({
    image: String,
    name: String,
    age: Number,
    breed: String
});

const Cat = mongoose.model('Cat', catSchema);

module.exports = Cat;