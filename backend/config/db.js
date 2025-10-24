const mongoose = require('mongoose');
const dotenv = require('dotenv');

// load .env here to ensure variables are available when this module is used directly
dotenv.config();

const connectDB = (attempt = 1) => {
  // support multiple common env names
  const uri = process.env.MONGODB_URI || process.env.MONGO_URI || process.env.DATABASE_URL;

  if (!uri) {
    console.error('MongoDB connection error: MONGODB_URI (or MONGO_URI / DATABASE_URL) is not defined.');
    console.error('Create a .env file in the project root with a line like:');
    console.error('MONGODB_URI=mongodb://localhost:27017/mern_blog');
    // Do not exit here so developer can create .env without crashing nodemon immediately
    return;
  }

  mongoose
    .connect(uri, {
      // options are optional with Mongoose 6+
      // keep default options; adjust if you have specific needs
    })
    .then(() => {
      console.log('MongoDB connected');
    })
    .catch((error) => {
      console.error('MongoDB connection error:', error.message);
      // exponential backoff with cap: 5s, 10s, 20s, 30s...
      const maxDelay = 30000;
      const baseDelay = 5000; // 5 seconds
      const delay = Math.min(maxDelay, baseDelay * Math.pow(2, attempt - 1));
      console.log(`Retrying MongoDB connection in ${delay / 1000}s (attempt ${attempt})`);
      setTimeout(() => connectDB(attempt + 1), delay);
    });

  // Optional: listen to disconnection and attempt reconnects
  mongoose.connection.on('disconnected', () => {
    console.warn('Mongoose disconnected. Will attempt to reconnect...');
  });
};

module.exports = connectDB;
