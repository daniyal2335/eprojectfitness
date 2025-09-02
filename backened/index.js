import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';

import authRoutes from './routes/auth.js';
import profileRoutes from './routes/profile.js';
import workoutRoutes from './routes/workouts.js';
import nutritionRoutes from './routes/nutrition.js';
import progressRoutes from './routes/progress.js';
import dashboardRoutes from './routes/dashboard.js';
import searchRoutes from './routes/search.js';
import exportRoutes from './routes/export.js';
import notificationRoutes from './routes/notifications.js';

import { errorHandler } from './middleware/errorHandler.js';

dotenv.config();

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(cors({ origin: process.env.CORS_ORIGIN, credentials: true }));
app.use(express.urlencoded({ extended: true }));
mongoose.connect(process.env.DB_URL).then(()=>console.log('DB connected')).catch(e=>console.error(e.message));

app.use('/api/auth', authRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/workouts', workoutRoutes);
app.use('/api/nutrition', nutritionRoutes);
app.use('/api/progress', progressRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/search', searchRoutes);
app.use('/api/export', exportRoutes);
app.use('/api/notifications', notificationRoutes);


app.use(errorHandler);

app.listen(process.env.PORT, ()=> console.log(`Server on ${process.env.PORT}`));
