import express from 'express';
import axios from 'axios';
import ChargingStation from '../models/ChargingStation.js';
import PopularRoute from '../models/PopularRoute.js';

const router = express.Router();

// Plan a trip
router.post('/plan', async (req, res) => {
  try {
    const { start, destination, batteryRange } = req.body;
    
    // First check if this is a popular route
    const popularRoute = await PopularRoute.findOne({
      $or: [
        {
          'startLocation.coordinates': [start.lng, start.lat],
          'endLocation.coordinates': [destination.lng, destination.lat]
        },
        {
          'startLocation.coordinates': [destination.lng, destination.lat],
          'endLocation.coordinates': [start.lng, start.lat]
        }
      ]
    });

    if (popularRoute) {
      // Return the popular route with its predefined charging stations
      res.json({
        route: {
          distance: popularRoute.distance,
          duration: popularRoute.estimatedDuration * 60, // Convert to seconds
          geometry: popularRoute.routeGeometry
        },
        chargingStations: popularRoute.chargingStations,
        requiredStops: Math.ceil(popularRoute.distance / batteryRange) - 1,
        isPopular: true
      });
    } else {
      // Get route from OSRM
      const routeUrl = `https://router.project-osrm.org/route/v1/driving/${start.lng},${start.lat};${destination.lng},${destination.lat}?overview=full&geometries=geojson`;
      const routeResponse = await axios.get(routeUrl);
      const route = routeResponse.data.routes[0];
      
      // Calculate required stops
      const totalDistance = route.distance / 1000; // Convert to km
      const requiredStops = Math.ceil(totalDistance / batteryRange) - 1;
      
      // Get charging stations along the route
      const routeCoordinates = route.geometry.coordinates;
      const chargingStations = [];
      
      if (requiredStops > 0) {
        // Sample points along the route to find nearby charging stations
        const sampleInterval = Math.floor(routeCoordinates.length / (requiredStops + 2));
        
        for (let i = 1; i <= requiredStops; i++) {
          const pointIndex = i * sampleInterval;
          if (pointIndex < routeCoordinates.length) {
            const point = routeCoordinates[pointIndex];
            
            // Find nearby charging stations
            const nearbyStations = await ChargingStation.find({
              location: {
                $near: {
                  $geometry: {
                    type: 'Point',
                    coordinates: point
                  },
                  $maxDistance: 20000 // 20km radius
                }
              }
            }).limit(3);
            
            chargingStations.push(...nearbyStations);
          }
        }
      }
      
      // Remove duplicates
      const uniqueStations = Array.from(new Map(
        chargingStations.map(station => [station._id.toString(), station])
      ).values());
      
      res.json({
        route: {
          distance: totalDistance,
          duration: route.duration,
          geometry: route.geometry
        },
        chargingStations: uniqueStations,
        requiredStops,
        isPopular: false
      });
    }
  } catch (error) {
    console.error('Trip planning error:', error);
    res.status(500).json({ message: error.message });
  }
});

export default router;