// client/src/utils/api.js
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const api = {
  // Charging stations
  async getNearbyStations(lat, lng, radius = 50) {
    const response = await fetch(
      `${API_BASE_URL}/charging-stations/nearby?lat=${lat}&lng=${lng}&radius=${radius * 1000}`
    );
    if (!response.ok) throw new Error('Failed to fetch stations');
    return response.json();
  },

  async getStationsAlongRoute(routeCoordinates, bufferDistance = 25) {
    const response = await fetch(`${API_BASE_URL}/charging-stations/along-route`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ routeCoordinates, bufferDistance: bufferDistance * 1000 })
    });
    if (!response.ok) throw new Error('Failed to fetch route stations');
    return response.json();
  },

  // Popular routes
  async checkPopularRoute(start, destination) {
    const response = await fetch(
      `${API_BASE_URL}/popular-routes/match?start=${encodeURIComponent(start)}&destination=${encodeURIComponent(destination)}`
    );
    if (!response.ok) return null;
    return response.json();
  },

  async getPopularRoutes() {
    const response = await fetch(`${API_BASE_URL}/popular-routes`);
    if (!response.ok) throw new Error('Failed to fetch routes');
    return response.json();
  }
};