const Cat = require("../model/catsModel");
const fs = require('fs');
const sharp = require('sharp');
/* const fetch = require('node-fetch'); */
const SocialPost = require("social-post-api"); // Install "npm i social-post-api"
// Live API Key
const social = new SocialPost("AXYWG3X-QEJMNZK-HW5ZCN2-RBP56NG");
// Define endpoint for retrieving breed ID by breed name
const BREEDS_ENDPOINT = 'https://api.thecatapi.com/v1/breeds';

// Define endpoint for searching cat images by breed ID
const IMAGES_ENDPOINT = 'https://api.thecatapi.com/v1/images/search';


exports.upload = async (req, res) => {

    try {
        // Check if there's a file in the request
        if (!req.files || Object.keys(req.files).length === 0) {
            return res.status(400).send('No files were uploaded.');
        }

        // Extract the cat data from the request body
        let { name, age, breed } = req.body;

        // Extract the uploaded image file from the request
        const image = req.files.image;
        console.log(req.body);
        console.log(req.files.image);
        // Upload the image file
        const imagePath = __dirname + '/../images/' + image.name;
        await image.mv(imagePath);

        // If breed is not provided, classify the breed from the uploaded image using the Cat API
        /* if (!breed) {
            const apiKey = 'live_9CfIwdJdTj1GcmG0mJOsfmpcn9riz3MPYCI9Pm6TLiimWhLdsieu935MmyiEb1iz';
            const response = await fetch(`https://api.thecatapi.com/v1/images/upload?api_key=${apiKey}&sub_id=${name}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
                body: new FormData().append('file', image.data),
            });
            const result = await response.json();
            console.log(result);
            breed = result.breeds[0].name;
        } */

        // Create a new cat document with the uploaded data
        const cat = new Cat({ name, age, breed, image: image.name });
        await cat.save();

        // Post a tweet
        const tweetMessage = `I just uploaded a picture of my cute ${cat.breed} cat named ${cat.name}! 😻🐾 #catsofinstagram`;
        const run = async () => {
            const post = await social.post({
                post: tweetMessage,
                platforms: ["twitter"],
                mediaUrls: ['https://backend.qwe1qwe2.repl.co/images/' + image.name],
            }).catch(console.error);
            console.log(post);
        };
        run()

        // Return the new cat document
        return res.status(201).send(cat);
    } catch (err) {
        console.error(err);
        return res.status(500).send(err);
    }
}

// List all cats with image data
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

        // Map each cat to a new object that includes the resized image data as a base64-encoded string
        const catList = await Promise.all(cats.map(async cat => {
            const imagePath = `images/${cat.image}`;
            if (!fs.existsSync(imagePath)) {
                console.error(`Image file ${imagePath} does not exist`);
                return null;
            }

            const resizedImage = await sharp(imagePath)
                .resize({ height: 300, width: 300 })
                .toBuffer();

            return {
                _id: cat._id,
                name: cat.name,
                age: cat.age,
                breed: cat.breed,
                image: `data:image/jpeg;base64,${resizedImage.toString('base64')}`
            };
        }));

        // Filter out any null entries in catList
        const validCatList = catList.filter(cat => cat !== null);

        // Return the cats as a JSON array
        return res.status(200).json(validCatList);
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
exports.get = async (req, res) => {
    try {
        const { catId } = req.params;
        let cats;

        if (catId) {
            // Retrieve a single cat by ID
            cat = await Cat.findById(catId);

            if (!cat) {
                return res.status(404).json({ message: 'Cat not found' });
            }
        } else {
            // Retrieve a list of all cats
            cats = await Cat.find({});
        }

        res.json(cats || cat);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};


/* // Export the controller function to be used in other modules
exports.getCatImagesByBreed = async (breedName) => {
    const apiKey = 'live_9CfIwdJdTj1GcmG0mJOsfmpcn9riz3MPYCI9Pm6TLiimWhLdsieu935MmyiEb1iz';
    try {
        // Retrieve the breed ID from the Cat API
        const breedResponse = await fetch(`${BREEDS_ENDPOINT}?name=${encodeURIComponent(breedName)}`, {
            headers: {
                'X-API-KEY': apiKey
            }
        });
        const breeds = await breedResponse.json();

        if (breeds.length === 0) {
            throw new Error(`Could not find breed '${breedName}'`);
        }

        const breedId = breeds[0].id;

        // Retrieve 10 random images for the given breed from the Cat API
        const imagesResponse = await fetch(`${IMAGES_ENDPOINT}?breed_id=${breedId}&limit=10`, {
            headers: {
                'X-API-KEY': apiKey
            }
        });
        const images = await imagesResponse.json();

        return images;
    } catch (err) {
        console.error(err);
        throw new Error('Error retrieving cat images');
    } 
}; */