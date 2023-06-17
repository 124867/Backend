const DirectMessage = require('../model/DirectMessage');
const Cat = require('../model/catsModel');
const User = require('../model/userModel');
const jwt = require('jsonwebtoken');

exports.sendDirectMessage = async (req, res) => {
  const { catId } = req.params;
  const token = req.query.token; // Retrieve JWT token from authorization header
  const { message } = req.body;

  try {
    // Find the corresponding cat and user documents
    // Verify the JWT token and extract user email
    const decodedToken = jwt.verify(token, 'igotoschoolbybus');
    const userEmail = decodedToken.email;

    const cat = await Cat.findById(catId);
    const user = await User.findOne({ email: userEmail });

    if (!cat || !user) {
      // If either document isn't found, return a 404 error
      return res.status(404).json({ message: 'Could not find the requested cat or user' });
    }

    // Create a new direct message object
    const newMessage = new DirectMessage({
      catId,
      userId: user._id,
      name: user.name,
      email: userEmail,
      message
    });

    // Save the message to the database
    await newMessage.save();

    // Return a success response
    return res.status(200).json({ message: 'Direct message sent successfully' });
  } catch (err) {
    console.error(err);
    return res.status(500).send(err);
  }
};


exports.getDirectMessagesForCat = async (req, res) => {
  const { catId } = req.params;

  try {
    // Find all direct messages for the specified cat ID, and join the associated cat and user documents
    const messages = await DirectMessage.find({ catId })
      .populate({
        path: 'userId',
        select: 'email',
        model: User,
      })
      .populate({
        path: 'catId',
        model: Cat,
      });

    // Return the messages as JSON with the associated cat and user documents included
    return res.json(messages);
  } catch (err) {
    console.error(err);
    return res.status(500).send(err);
  }
};

exports.deleteDirectMessage = async (req, res) => {
  const { messageId } = req.params;

  try {
    // Find the direct message to be deleted and check if it belongs to the user
    const message = await DirectMessage.findById(messageId);
    if (!message) {
      // If the message isn't found, return a 404 error
      return res.status(404).json({ message: 'Could not find the requested message' });
    }
    // Delete the message from the database
    await DirectMessage.findByIdAndDelete(messageId);

    // Return a success response
    return res.status(200).json({ message: 'Direct message deleted successfully' });
  } catch (err) {
    console.error(err);
    return res.status(500).send(err);
  }
};
