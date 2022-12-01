import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import hotelRoute from './routes/hotel.routes.js';
import authRoute from './routes/auth.routes.js';
import userRoute from './routes/user.routes.js';
import roomRoute from './routes/room.routes.js';
import cookieParser from 'cookie-parser';
import cors from 'cors';

const app = express();
dotenv.config();

const connect = async () => {
  try {
    await mongoose.connect(process.env.MONGO);
    console.log('MongoDB Connect!');
  } catch (err) {
    throw err;
  }
};

// mongoose.connection.on('disconnected', () => {
//   console.log('Disconnected to mongoDB');
// });
// mongoose.connection.on('connected', () => {
//   console.log('connected to mongoDB');
// });
app.use(cors());
app.use(express.json());
app.use(cookieParser());

// Register Route to app
app.use('/api/hotels', hotelRoute);
app.use('/api/auth', authRoute);
app.use('/api/users', userRoute);
app.use('/api/rooms', roomRoute);

// Global Middleware
app.use((err, req, res, next) => {
  const errorStatus = err.status || 500;
  const errorMessage = err.message || 'Something went wrong!';
  return res.status(errorStatus).json({
    success: false,
    status: errorStatus,
    message: errorMessage,
    stack: err.stack,
  });
});

const PORT = 8800;
app.listen(8800, () => {
  connect();
  console.log('Server running in port ' + PORT);
});
