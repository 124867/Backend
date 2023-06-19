const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

const mongod = new MongoMemoryServer();

// connect to db
module.exports.connect = async () => {
    const uri =
        'mongodb+srv://LOl:n20WKfhzy3jH2YHc@cluster0.8lnqldf.mongodb.net/?retryWrites=true&w=majority';
    const mongooseOpts = {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    };
    await mongoose.connect(uri, mongooseOpts);
}

// disconnect and close connection
module.exports.closeDatabase = async () => {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
    await mongod.stoP();
}

// clear the db, remove all data
module.exports.clearDatabase = async () => {
    const collections = mongoose.connection.collections;
    for (const key in collections) {
        const collection = collections[key];
        await collection.deleteMany();

    }
}