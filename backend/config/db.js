const mongoose = require('mongoose');

async function connectDB() {
    try {
        const uri = process.env.MONGODB_URI;
        console.log('MongoDB URI:', uri ? uri.slice(0, 40) + '...' : uri);
        await mongoose.connect(uri);
        console.log('MongoDB connected');
    } catch (err) {
        console.log(err);
        process.exit(1);
    }
}

module.exports = connectDB;