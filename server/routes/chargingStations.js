import express from 'express';
import ChargingStation from '../models/ChargingStation.js';

const router = express.Router();

// Get charging stations near a point
router.get('/nearby', async (req, res) => {
  try {
    const { lat, lng, radius = 50000 } = req.query; // radius in meters

    if (!lat || !lng) {
      return res.status(400).json({ error: 'Latitude and longitude are required' });
    }

    const stations = await ChargingStation.find({
      location: {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [parseFloat(lng), parseFloat(lat)]
          },
          $maxDistance: parseInt(radius)
        }
      }
    }).limit(20);

    res.json(stations);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get stations along a route
router.post('/along-route', async (req, res) => {
  try {
    const { routeCoordinates, bufferDistance = 25000 } = req.body; // buffer in meters
    
    if (!routeCoordinates || !Array.isArray(routeCoordinates)) {
      return res.status(400).json({ error: 'Route coordinates are required' });
    }

    // Find stations near multiple points along the route
    const stations = new Map(); // Use Map to avoid duplicates
    
    // Sample every 10th point to reduce queries
    const sampleRate = Math.max(1, Math.floor(routeCoordinates.length / 20));
    
    for (let i = 0; i < routeCoordinates.length; i += sampleRate) {
      const [lat, lng] = routeCoordinates[i];
      
      const nearbyStations = await ChargingStation.find({
        location: {
          $near: {
            $geometry: {
              type: 'Point',
              coordinates: [lng, lat]
            },
            $maxDistance: bufferDistance
          }
        }
      }).limit(10);
      
      nearbyStations.forEach(station => {
        stations.set(station._id.toString(), station);
      });
    }

    res.json(Array.from(stations.values()));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get all charging stations
router.get('/', async (req, res) => {
  try {
    const stations = await ChargingStation.find().limit(100);
    res.json(stations);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get a single charging station
router.get('/:id', async (req, res) => {
  try {
    const station = await ChargingStation.findById(req.params.id);
    if (!station) {
      return res.status(404).json({ error: 'Station not found' });
    }
    res.json(station);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Add a new charging station
router.post('/', async (req, res) => {
  try {
    const station = new ChargingStation({
      ...req.body,
      location: {
        type: 'Point',
        coordinates: [req.body.longitude, req.body.latitude]
      }
    });
    
    await station.save();
    res.status(201).json(station);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Update a charging station
router.put('/:id', async (req, res) => {
  try {
    const station = await ChargingStation.findByIdAndUpdate(
      req.params.id,
      { ...req.body, updatedAt: Date.now() },
      { new: true }
    );
    
    if (!station) {
      return res.status(404).json({ error: 'Station not found' });
    }
    
    res.json(station);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Delete a charging station
router.delete('/:id', async (req, res) => {
  try {
    const station = await ChargingStation.findByIdAndDelete(req.params.id);
    
    if (!station) {
      return res.status(404).json({ error: 'Station not found' });
    }
    
    res.json({ message: 'Station deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;