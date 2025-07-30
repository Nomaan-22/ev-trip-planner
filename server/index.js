import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './utils/database.js';
import chargingStationRoutes from './routes/chargingStations.js';
import popularRoutesRoutes from './routes/popularRoutes.js';
import tripRoutes from './routes/trip.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/charging-stations', chargingStationRoutes);
app.use('/api/popular-routes', popularRoutesRoutes);
app.use('/api/trip', tripRoutes);  // ADD THIS LINE

// Test route
app.get('/api/test', (req, res) => {
  res.json({ message: 'EV Trip Planner API is running!' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});