import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import { createServer } from 'http';
import { Server } from 'socket.io';

import authRoutes from './routes/auth.js';
import profileRoutes from './routes/profile.js';
import workoutRoutes from './routes/workouts.js';
import nutritionRoutes from './routes/nutrition.js';
import progressRoutes from './routes/progress.js';
import dashboardRoutes from './routes/dashboard.js';
import searchRoutes from './routes/search.js';
import exportRoutes from './routes/export.js';
import notificationRoutes from './routes/notifications.js';
import forumRoutes from './routes/forumRoutes.js';
import { errorHandler } from './middleware/errorHandler.js';

dotenv.config();

const app = express();

// Middlewares
app.use(express.json());
app.use(cookieParser());
app.use(cors({ origin: process.env.CORS_ORIGIN, credentials: true }));
app.use(express.urlencoded({ extended: true }));

// DB connect
mongoose
  .connect(process.env.DB_URL)
  .then(() => console.log('✅ DB connected'))
  .catch((e) => console.error(e.message));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/workouts', workoutRoutes);
app.use('/api/nutrition', nutritionRoutes);
app.use('/api/progress', progressRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/search', searchRoutes);
app.use('/api/export', exportRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/forum', forumRoutes);

app.use(errorHandler);
const server = createServer(app);


const io = new Server(server, {
  cors: {
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  },
});

app.set('io', io);
io.on('connection', (socket) => {
  console.log('🔌 Client connected:', socket.id);


  socket.on('join', (userId) => {
    console.log(`✅ User ${userId} joined room (socket: ${socket.id})`);
    socket.join(userId);
  
    socket.emit("joined", { room: userId });
  });


  socket.on('leave', (userId) => {
    console.log(`❌ User ${userId} left room (socket: ${socket.id})`);
    socket.leave(userId);
  });


  socket.on('sendMessage', (data) => {
    console.log('📩 Message received:', data);
    io.emit('receiveMessage', data);
  });

  socket.on('disconnect', () => {
    console.log(`❌ Client disconnected: ${socket.id}`);
  });
});




const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
