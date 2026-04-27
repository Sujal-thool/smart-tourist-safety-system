import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import http from 'http';
import { Server } from 'socket.io';
import connectDB from './config/db.js';

// Load env vars
dotenv.config();

// Connect to database
connectDB();

const app = express();
const server = http.createServer(app);

// Socket.io configuration
export const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
  },
});

// Middleware
app.use(express.json());
app.use(cors());

// Route files
import authRoutes from './routes/authRoutes.js';
import touristRoutes from './routes/touristRoutes.js';

// Mount routers
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/tourist', touristRoutes);

app.get('/', (req, res) => {
  res.send('Smart Tourist Safety API is running...');
});

// Load Socket Handler
import socketHandler from './sockets/socketHandler.js';
socketHandler(io);

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});
