// src/utils/routeCalculations.js

export function getDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // Radius of Earth in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
}

export function getDirection(from, to) {
  const dLon = (to[1] - from[1]) * Math.PI / 180;
  const lat1 = from[0] * Math.PI / 180;
  const lat2 = to[0] * Math.PI / 180;
  
  const y = Math.sin(dLon) * Math.cos(lat2);
  const x = Math.cos(lat1) * Math.sin(lat2) - Math.sin(lat1) * Math.cos(lat2) * Math.cos(dLon);
  
  const bearing = Math.atan2(y, x);
  return ((bearing * 180 / Math.PI) + 360) % 360;
}

export function calculateDetour(from, via, to) {
  const directDistance = getDistance(from[0], from[1], to[0], to[1]);
  const detourDistance = 
    getDistance(from[0], from[1], via[0], via[1]) + 
    getDistance(via[0], via[1], to[0], to[1]);
  
  return detourDistance - directDistance;
}

export function calculateChargeTimeBasedOnPower(currentRange, targetRange, chargerPower) {
  const rangeNeeded = targetRange - currentRange;
  const kWhNeeded = rangeNeeded / 5;
  const effectivePower = chargerPower || 50;
  const avgChargingPower = effectivePower * 0.8;
  const hours = kWhNeeded / avgChargingPower;
  const minutes = Math.ceil(hours * 60);
  return Math.max(15, Math.min(minutes, 90));
}

export async function geocodeNominatim(place) {
  try {
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const res = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(place)}&limit=1`,
      {
        headers: {
          'User-Agent': 'EV-Trip-Planner/1.0'
        }
      }
    );
    
    if (!res.ok) {
      throw new Error(`Geocoding failed: ${res.status}`);
    }
    
    const data = await res.json();
    
    if (!data || data.length === 0) {
      throw new Error(`Location not found: ${place}`);
    }
    
    return [
      parseFloat(data[0].lat),
      parseFloat(data[0].lon)
    ];
  } catch (error) {
    console.error('Geocoding error:', error);
    throw error;
  }
}

export async function getRouteOSRM(startCoords, destCoords) {
  try {
    const url = `https://router.project-osrm.org/route/v1/driving/${startCoords[1]},${startCoords[0]};${destCoords[1]},${destCoords[0]}?overview=full&geometries=geojson`;
    
    const res = await fetch(url);

    if (!res.ok) {
      throw new Error(`Route calculation failed: ${res.status}`);
    }

    const data = await res.json();
    
    if (!data.routes || data.routes.length === 0) {
      throw new Error('No route found');
    }
    
    const route = data.routes[0];
    const coords = route.geometry.coordinates.map(([lng, lat]) => [lat, lng]);
    const distance = route.distance / 1000; // Convert to km
    
    return { routeCoords: coords, distance };
  } catch (error) {
    console.error('Route error:', error);
    throw error;
  }
}

export async function getRouteWithWaypoints(startCoords, destCoords, waypoints = []) {
  try {
    let coordsString = `${startCoords[1]},${startCoords[0]}`;
    waypoints.forEach(wp => {
      coordsString += `;${wp[1]},${wp[0]}`;
    });
    coordsString += `;${destCoords[1]},${destCoords[0]}`;
    
    const url = `https://router.project-osrm.org/route/v1/driving/${coordsString}?overview=full&geometries=geojson`;
    
    const res = await fetch(url);

    if (!res.ok) {
      throw new Error(`Route calculation failed: ${res.status}`);
    }

    const data = await res.json();
    
    if (!data.routes || data.routes.length === 0) {
      throw new Error('No route found');
    }
    
    const route = data.routes[0];
    const coords = route.geometry.coordinates.map(([lng, lat]) => [lat, lng]);
    const distance = route.distance / 1000; // Convert to km
    
    return { routeCoords: coords, distance };
  } catch (error) {
    console.error('Route error:', error);
    throw error;
  }
}