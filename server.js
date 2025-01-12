const express = require('express');
const connectDB = require('./config/db');
const cloudinary = require('cloudinary');
const config = require('config'); // Import config module
const app = express();
var server = require('http').Server(app);
const io = require('socket.io')(server);
const globalErrorHandler = require('./controllers/errorController.js');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const AppError = require('./utils/appError');
const dotenv = require('dotenv').config({ path: './config.env' });

// Load configuration from default.json
const mongoURI = config.get('mongoURI');
const cloudinaryConfig = config.get('cloudinary');

// Connect Database
connectDB(mongoURI);
connectDB();

// Cloudinary Setup for image upload
cloudinary.config({
  cloud_name: cloudinaryConfig.cloud_name,
  api_key: cloudinaryConfig.api_key,
  api_secret: cloudinaryConfig.api_secret
});

// Socket.IO for real-time bidding
io.on('connection', function (socket) {
  var room = socket.handshake['query']['r_var'];

  socket.on('join', function () {
    socket.join(room);
    console.log('[socket]', 'join room :', room);
  });

  socket.on('unsubscribe', function (room) {
    try {
      console.log('[socket]', 'leaving room :', room);
      socket.leave(room);
      console.log('[socket]', 'left room :', room);
    } catch (e) {
      console.log('[error]', 'leave room :', e);
    }
  });

  socket.on('bid', function () {
    io.to(room).emit('bid');
    console.log('user made bid on ' + room);
  });

  socket.on('deleted bid', function () {
    io.to(room).emit('bid');
    console.log('user made bid on ' + room);
  });

  socket.on('chat message', function (msg) {
    io.to(room).emit('chat message', msg);
  });
});

// Data sanitization against NoSQL query injections
app.use(mongoSanitize());

// Data Sanitization against XSS
app.use(xss());

// Init Middleware
app.use(express.json({ extended: false }));

// Define Routes
app.use('/api/users', require('./routes/api/userRouter'));
app.use('/api/listings', require('./routes/api/listingRouter'));
app.use('/api/auth', require('./routes/api/authRouter'));
app.use('/api/review', require('./routes/api/reviewRouter'));
app.use('/api/report', require('./routes/api/reportRouter'));

app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(globalErrorHandler);

const PORT = process.env.PORT || 5001;

// const PORT = process.env.PORT || 5001; // Use 5001 or any other free port
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});


if (process.env.NODE_ENV !== 'test') {
  server.listen(PORT, () => console.log(`Server started on port ${PORT}`));
}



module.exports = server;
