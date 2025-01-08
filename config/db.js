const mongoose = require('mongoose');
const config = require('config');

const connectDB = async (mongoURI) => {
  try {
    const conn = await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (err) {
    console.error(`Database Connection Error: ${err.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
