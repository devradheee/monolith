// const mongoose = require('mongoose');
// const config = require('config');


// const mongoose = require('mongoose');
// mongoose.connect('mongodb://localhost:27017/your-database', {
//   // No need for useNewUrlParser or useUnifiedTopology
// });

// const connectDB = async (mongoURI) => {
//   try {
//     const conn = await mongoose.connect(mongoURI, {
//       useNewUrlParser: true,
//       useUnifiedTopology: true,
//     });
//     console.log(`MongoDB Connected: ${conn.connection.host}`);
//   } catch (err) {
//     console.error(`Database Connection Error: ${err.message}`);
//     process.exit(1);
//   }
// };

// module.exports = connectDB;


const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    await mongoose.connect('mongodb://localhost:27017/your-database-name', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB Connected');
  } catch (err) {
    console.error(err.message);
    process.exit(1);
  }
};

module.exports = connectDB;
