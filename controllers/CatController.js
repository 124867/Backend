const Cat = require("../model/catsModel");

// Upload a new cat
exports.upload = async (req, res) => {
  try {
    // Check if there's a file in the request
    if (!req.files || Object.keys(req.files).length === 0) {
      return res.status(400).send('No files were uploaded.');
    }

    // Extract the cat data from the request body
    const { name, age, breed } = req.body;

    // Extract the uploaded image file from the request
    const image = req.files.image;

    // Upload the image file
    const imagePath = __dirname + '/../images/' + image.name;
    await image.mv(imagePath);

    // Create a new cat document with the uploaded data
    const cat = new Cat({ name, age, breed, image: image.name });
    await cat.save();

    // Return the new cat document
    return res.status(201).send(cat);
  } catch (err) {
    console.error(err);
    return res.status(500).send(err);
  }
};

// List all cats
exports.list = async (req, res) => {
  try {
    // Get the query parameters from the request
    const { name, age, breed } = req.query;

    // Build the filter object based on the query parameters
    const filter = {};
    if (name) filter.name = { $regex: name, $options: 'i' };
    if (age) filter.age = age;
    if (breed) filter.breed = { $regex: breed, $options: 'i' };

    // Find all the cats that match the filter, or all the cats if no filter is specified
    const cats = await Cat.find(filter);

    // Map each cat to a new object that includes the image file path
    const catList = cats.map(cat => ({
      _id: cat._id,
      name: cat.name,
      age: cat.age,
      breed: cat.breed,
      image: `../images/${cat.image}`
    }));

    // Return the cats as a JSON array
    return res.status(200).json(catList);
  } catch (err) {
    console.error(err);
    return res.status(500).send(err);
  }
};

// Delete a cat by ID
exports.delete = async (req, res) => {
  try {
    // Find the cat by ID and delete it
    const cat = await Cat.findByIdAndDelete(req.params.id);

    // If the cat doesn't exist, return a 404 error
    if (!cat) {
      return res.status(404).send('Cat not found.');
    }

    // Remove the image file from the server
    const imagePath = __dirname + '/../images/' + cat.image;
    fs.unlinkSync(imagePath);

    // Return a success message
    return res.status(200).send('Cat deleted successfully.');
  } catch (err) {
    console.error(err);
    return res.status(500).send(err);
  }
};

// Update a cat by ID
exports.update = async (req, res) => {
  try {
    // Find the cat by ID and update its data
    const cat = await Cat.findByIdAndUpdate(req.params.id, req.body, { new: true });

    // If the cat doesn't exist, return a 404 error
    if (!cat) {
      return res.status(404).send('Cat not found.');
    }

    // If a new image was uploaded, replace the old image file with the new one
    if (req.files && req.files.image) {
      const image = req.files.image;
      const imagePath = __dirname + '/../images/' + image.name;
      await image.mv(imagePath);
      const oldImagePath = __dirname + '/../images/' + cat.image;
      fs.unlinkSync(oldImagePath);
      cat.image = image.name;
    }

    // Save the updated cat document
    await cat.save();

    // Return the updated cat document
    return res.status(200).send(cat);
  } catch (err) {
    console.error(err);
    return res.status(500).send(err);
  }
};