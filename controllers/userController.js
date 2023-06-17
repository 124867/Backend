const bcrypt = require('bcrypt');
const User = require('../model/userModel');
const Cat = require('../model/catsModel');
const path = require('path');
const jwt = require('jsonwebtoken');

// Create User
exports.create = async (req, res) => {
  const { email, password } = req.body;

  bcrypt.genSalt(10, (err, salt) => {
    bcrypt.hash(password, salt, async (err, hash) => {
      const user = new User({ email, password: hash, role: 'user' });
      try {
        await user.save();
        return res.status(200).send('User registered successfully.');
      } catch (err) {
        return res.status(500).send(err);
      }
    });
  });
};
// List user's favorite cats
exports.favourites = async (req, res) => {
  try {
    const userEmail = req.user.email;

    // Find the user in the database
    const user = await User.findOne({ email: userEmail });

    // If the user doesn't exist, return an error
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Get the user's favorite cat IDs
    const favoriteCats = user.favorites;

    // Find the favorite cats in the database
    const cats = await Cat.find({ _id: { $in: favoriteCats } });

    // Map each cat to a new object that includes the image file path
    const catList = cats.map(cat => ({
      _id: cat._id,
      name: cat.name,
      age: cat.age,
      breed: cat.breed,
      image: `../images/${cat.image}`
    }));

    // Return the favorite cats as a JSON array
    return res.status(200).json(catList);
  } catch (err) {
    console.error(err);
    return res.status(500).send(err);
  }
};
exports.removeFromFavorites = async (req, res) => {
  const catId = req.params.catId;
  const token = req.query.token;
  const decodedToken = jwt.verify(token, 'igotoschoolbybus');
  const userEmail = decodedToken.email;

  try {
    // Find the user in the database
    const user = await User.findOne({ email: userEmail });

    // If the user doesn't exist, return an error
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // If the cat is not in the user's favorites, return an error
    if (!user.favorites.includes(catId)) {
      return res.status(400).json({ error: 'Cat not in favorites' });
    }

    // Remove the cat ID from the user's favorites list
    user.favorites = user.favorites.filter(fav => fav !== catId);

    // Save the updated user object to the database
    await user.save();

    // Return a success message
    return res.status(200).json({ message: 'Cat removed from favorites successfully' });
  } catch (err) {
    console.error(err);
    return res.status(500).send(err);
  }
};


exports.addToFavorites = async (req, res) => {
  const catId = req.params.catId;
  const token = req.query.token;

  try {
    // Verify the JWT token and extract user email
    const decodedToken = jwt.verify(token, 'igotoschoolbybus');
    const userEmail = decodedToken.email;

    // Find the user in the database based on email
    const user = await User.findOne({ email: userEmail });

    // If the user doesn't exist, return an error
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // If the cat is already in the user's favorites, return an error
    if (user.favorites.includes(catId)) {
      return res.status(400).json({ error: 'Cat already in favorites' });
    }

    // Add the cat ID to the user's favorites list
    user.favorites.push(catId);

    // Save the updated user object to the database
    await user.save();

    // Return a success message
    return res.status(200).json({ message: 'Cat added to favorites successfully' });
  } catch (err) {
    console.error(err);
    return res.status(500).send(err);
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({ error: 'User not found.' });
    }

    const result = await bcrypt.compare(password, user.password);

    if (!result) {
      return res.status(401).json({ error: 'Incorrect password.' });
    }

    const secret = 'igotoschoolbybus';
    const token = jwt.sign({ email, role: user.role }, secret, { algorithm: 'HS256' });

    return res.status(200).json({ token });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
exports.home = (req, res) => {
  const { user } = req;
  res.render('user-home', { user });
};

