import { 
  fetchNearbyStations, 
  fetchOpenChargeMapStations,
  API_BASE_URL 
} from './chargingStations';
import { 
  getDistance, 
  getDirection, 
  calculateDetour,
  calculateChargeTimeBasedOnPower,
  getRouteOSRM
} from './routeCalculations';

export async function checkPopularRoute(start, destination) {
  try {
    const normalizeCity = (city) => {
      return city
        .toLowerCase()
        .trim()
        .replace(/\s+/g, ' ')
        .replace(/\b(city|railway station|airport|cantt|cantonment)\b/gi, '')
        .trim();
    };
    
    const normalizedStart = normalizeCity(start);
    const normalizedDest = normalizeCity(destination);
    
    console.log(`Checking popular route: ${normalizedStart} -> ${normalizedDest}`);
    
    // Use the corrected backend query logic
    const response = await fetch(
      `${API_BASE_URL}/popular-routes/match?start=${encodeURIComponent(normalizedStart)}&destination=${encodeURIComponent(normalizedDest)}`
    );
    
    if (response.ok) {
      const route = await response.json();
      if (route) {
        console.log('Found match for popular route');
        return route;
      }
    }
    
    console.log('No popular route found');
    return null;
  } catch (error) {
    console.error('Error checking popular route:', error);
    return null;
  }
}

// CORRECTED LOGIC
// src/utils/tripPlanning.js

// Replace the existing filterStationsForRange function with this one.
export function filterStationsForRange(routeStations, totalDistance, currentRange, maxRange) {
  const buffer = 30; // Safety buffer in km
  const neededStations = [];
  
  console.log('Filtering stations. Inputs: TotalDist:', totalDistance, 'CurrentRange:', currentRange, 'MaxRange:', maxRange);
  
  if (currentRange <= 0) {
    return { stations: [], isPossible: false, reason: 'Current battery range is zero or negative.' };
  }
  
  const sortedStations = [...routeStations]
    .filter(s => s.stationId)
    .sort((a, b) => a.distanceFromStart - b.distanceFromStart);
  
  let currentPosition = 0;
  let availableRange = currentRange;
  let isFirstLeg = true; // Flag to track the first leg of the trip
  
  while (currentPosition < totalDistance) {
    if (currentPosition + availableRange >= totalDistance) {
      console.log('Can reach destination from current position.');
      break;
    }
    
    const reachableStations = sortedStations.filter(stationData => {
      const distanceToStation = stationData.distanceFromStart - currentPosition;
      if (distanceToStation <= 0) return false;

      // **THE CRITICAL FIX IS HERE**
      if (isFirstLeg) {
        // For the first leg, we don't use the buffer. We use the exact current range.
        return distanceToStation <= availableRange;
      } else {
        // For all subsequent legs, we use the max range and apply the safety buffer.
        return (distanceToStation + buffer) <= availableRange;
      }
    });
    
    if (reachableStations.length === 0) {
      const nextStation = sortedStations.find(s => s.distanceFromStart > currentPosition);
      const reason = nextStation
        ? `Cannot reach the next station (${nextStation.stationId.name} at ${nextStation.distanceFromStart.toFixed(0)}km). Need to cover ${(nextStation.distanceFromStart - currentPosition).toFixed(0)}km but only have ${availableRange.toFixed(0)}km range.`
        : `Cannot reach the destination. Need to cover ${(totalDistance - currentPosition).toFixed(0)}km but only have ${availableRange.toFixed(0)}km range.`;
      
      return { stations: [], isPossible: false, reason };
    }
    
    const bestStationData = reachableStations[reachableStations.length - 1];
    neededStations.push(bestStationData);
    
    currentPosition = bestStationData.distanceFromStart;
    availableRange = maxRange; // After charging, we have the car's max range for the next leg
    isFirstLeg = false; // All subsequent legs are not the first
  }
  
  // Final check to destination
  const lastStopPosition = neededStations.length > 0 ? neededStations[neededStations.length - 1].distanceFromStart : 0;
  const finalLegDistance = totalDistance - lastStopPosition;
  const finalRange = isFirstLeg ? currentRange : maxRange;

  if (finalLegDistance > finalRange) {
      return { 
          stations: [], 
          isPossible: false, 
          reason: `Cannot reach destination from the last point. Final stretch is ${finalLegDistance.toFixed(0)}km but available range is only ${finalRange.toFixed(0)}km.` 
      };
  }

  // Map to the final format for the UI
  const finalStations = neededStations.map(stationData => ({
      _id: stationData.stationId._id,
      lat: stationData.stationId.location.coordinates[1],
      lng: stationData.stationId.location.coordinates[0],
      name: stationData.stationId.name,
      address: stationData.stationId.address,
      // ... and other fields you need for the UI
  }));

  return { stations: finalStations, isPossible: true };
}


// The rest of the functions in this file (findChargingStationsAlongRoute, etc.) remain the same.
// ... (paste the rest of your original tripPlanning.js file here)
export async function findChargingStationsAlongRoute(routeCoords, totalDistance, currentRange, maxRange) {
  const buffer = 30;
  const plannedStops = [];
  
  let distanceCovered = 0;
  let availableRange = currentRange - buffer;
  const pointsPerKm = routeCoords.length / totalDistance;
  
  console.log(`Planning stops: Total distance ${totalDistance}km, Current range ${currentRange}km`);
  
  const startPoint = routeCoords[0];
  const endPoint = routeCoords[routeCoords.length - 1];
  
  while (distanceCovered + availableRange < totalDistance) {
    const targetDistance = distanceCovered + availableRange;
    console.log(`Need charging around ${targetDistance.toFixed(0)}km mark`);
    
    const targetIndex = Math.floor(targetDistance * pointsPerKm);
    const targetPoint = routeCoords[Math.min(targetIndex, routeCoords.length - 1)];
    const [lat, lng] = targetPoint;
    
    const prevIndex = Math.max(0, targetIndex - Math.floor(20 * pointsPerKm));
    const prevPoint = routeCoords[prevIndex];
    const nextIndex = Math.min(routeCoords.length - 1, targetIndex + Math.floor(20 * pointsPerKm));
    const nextPoint = routeCoords[nextIndex];
    
    let stations = await fetchNearbyStations(lat, lng, 30);
    
    if (stations.length === 0) {
      console.log('No stations in our database, trying OpenChargeMap...');
      const ocmStations = await fetchOpenChargeMapStations(lat, lng, 30);
      stations = ocmStations;
      
      if (stations.length === 0) {
        console.log('Expanding OpenChargeMap search radius to 50km...');
        const largerOcmStations = await fetchOpenChargeMapStations(lat, lng, 50);
        stations = largerOcmStations;
      }
    }
    
    console.log(`Found ${stations.length} total stations from all sources`);
    
    const filteredStations = stations.filter(station => {
      const stationDir = getDirection(targetPoint, [station.lat, station.lng]);
      const routeDir = getDirection(prevPoint, nextPoint);
      
      const angleDiff = Math.abs(stationDir - routeDir);
      const normalizedDiff = Math.min(angleDiff, 360 - angleDiff);
      
      const backwardCheck = getDistance(
        nextPoint[0], nextPoint[1], 
        station.lat, station.lng
      ) < getDistance(
        prevPoint[0], prevPoint[1], 
        station.lat, station.lng
      );
      
      const hasFastCharging = station.connectors?.some(c => c.power >= 50);
      const angleThreshold = hasFastCharging ? 120 : 90;
      
      return normalizedDiff < angleThreshold && backwardCheck;
    });
    
    console.log(`Filtered to ${filteredStations.length} stations based on direction`);
    
    let bestStation = null;
    let minScore = Infinity;
    
    for (const station of filteredStations) {
      const dist = getDistance(lat, lng, station.lat, station.lng);
      const detourDistance = calculateDetour(prevPoint, [station.lat, station.lng], nextPoint);
      
      const maxPower = Math.max(...(station.connectors?.map(c => c.power) || [0]));
      const chargingSpeedBonus = maxPower >= 100 ? 0.7 : maxPower >= 50 ? 0.85 : 1.0;
      
      const score = (dist + detourDistance * 0.5) * chargingSpeedBonus;
      
      if (score < minScore && dist < 40) {
        minScore = score;
        bestStation = {
          ...station,
          distanceFromRoute: dist,
          rangeNeeded: targetDistance - distanceCovered,
          recommendedChargeTime: calculateChargeTimeBasedOnPower(
            availableRange, 
            maxRange, 
            maxPower
          ),
          detourDistance: detourDistance
        };
      }
    }
    
    if (bestStation) {
      console.log(`Selected: ${bestStation.name} - ${bestStation.distanceFromRoute.toFixed(1)}km from route`);
      if (bestStation.dataProvider) {
        console.log(`Data source: ${bestStation.dataProvider}`);
      }
      plannedStops.push(bestStation);
      distanceCovered = targetDistance;
      availableRange = maxRange - buffer;
    } else {
      console.warn('No suitable charging station found along route direction');
      const emergencyStation = await findEmergencyStation(
        targetPoint, 
        stations.length > 0 ? stations : await fetchOpenChargeMapStations(lat, lng, 100),
        targetDistance - distanceCovered,
        maxRange
      );
      
      if (emergencyStation) {
        console.log(`Emergency station selected: ${emergencyStation.name}`);
        plannedStops.push(emergencyStation);
        distanceCovered = targetDistance;
        availableRange = maxRange - buffer;
      } else {
        console.error('Cannot find any charging station - trip may not be possible');
        break;
      }
    }
    
    if (plannedStops.length > 15) {
      console.warn('Too many stops planned - trip may not be practical');
      break;
    }
  }
  
  console.log(`Planned ${plannedStops.length} charging stops`);
  return plannedStops;
}

async function findEmergencyStation(targetPoint, allStations, rangeNeeded, maxRange) {
  if (allStations.length === 0) return null;
  
  const sortedByDistance = allStations
    .map(station => ({
      ...station,
      distance: getDistance(targetPoint[0], targetPoint[1], station.lat, station.lng)
    }))
    .sort((a, b) => a.distance - b.distance);
  
  const closest = sortedByDistance[0];
  
  if (closest && closest.distance < 100) {
    return {
      ...closest,
      distanceFromRoute: closest.distance,
      rangeNeeded: rangeNeeded,
      recommendedChargeTime: calculateChargeTimeBasedOnPower(
        rangeNeeded, 
        maxRange,
        Math.max(...(closest.connectors?.map(c => c.power) || [50]))
      ),
      isEmergencyOption: true
    };
  }
  
  return null;
}

export async function calculateTripSegments(startCoords, destCoords, chargingStations) {
  const segments = [];
  let currentPos = startCoords;
  let currentName = "Start";
  
  for (let i = 0; i < chargingStations.length; i++) {
    const station = chargingStations[i];
    const stationCoords = [station.lat, station.lng];
    
    const segmentRoute = await getRouteOSRM(currentPos, stationCoords);
    
    segments.push({
      from: currentName,
      to: station.name || `Charging Stop ${i + 1}`,
      distance: segmentRoute.distance,
      rangeAtArrival: station.rangeNeeded ? 
        `~${Math.max(0, station.rangeNeeded - segmentRoute.distance).toFixed(0)}km remaining` : 
        null
    });
    
    currentPos = stationCoords;
    currentName = station.name || `Charging Stop ${i + 1}`;
  }
  
  const finalRoute = await getRouteOSRM(currentPos, destCoords);
  segments.push({
    from: currentName,
    to: "Destination",
    distance: finalRoute.distance
  });
  
  return segments;
}
