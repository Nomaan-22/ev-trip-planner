import express from 'express';
import PopularRoute from '../models/PopularRoute.js';

const router = express.Router();

// Get all popular routes
router.get('/', async (req, res) => {
  try {
    const routes = await PopularRoute.find().populate('chargingStations.stationId');
    res.json(routes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Match a route with popular routes
router.get('/match', async (req, res) => {
  try {
    const { start, destination } = req.query;
    
    console.log('Matching route:', start, '->', destination);
    
    // Normalize city names for matching
    const normalizedStart = start.toLowerCase().replace('bengaluru', 'bangalore');
    const normalizedDest = destination.toLowerCase();
    
    // Find a popular route that matches BOTH the start and destination keywords.
    // Using $and ensures both conditions must be true.
    const route = await PopularRoute.findOne({
      $and: [
        { keywords: { $in: [normalizedStart] } },
        { keywords: { $in: [normalizedDest] } }
      ]
    }).populate('chargingStations.stationId');
    
    if (route) {
      console.log('Found popular route:', route.name);
      console.log('Charging stations count:', route.chargingStations.length);
      
      // Make sure stations are populated
      if (route.chargingStations.length > 0 && route.chargingStations[0].stationId) {
        console.log('First station is populated.');
      }
      
      res.json(route);
    } else {
      console.log('No popular route found');
      res.status(404).json({ message: 'No popular route found' });
    }
  } catch (error) {
    console.error('Error matching route:', error);
    res.status(500).json({ message: error.message });
  }
});

export default router;