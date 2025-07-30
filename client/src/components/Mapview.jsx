// src/components/MapView.jsx (simplified main component)
import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import "./Mapview.css";

import ChargingStationMarker from './ChargingStationMarker';
import TripInfoPanel from './TripInfoPanel';
import { 
  checkPopularRoute, 
  filterStationsForRange, 
  findChargingStationsAlongRoute,
  calculateTripSegments 
} from '../utils/tripPlanning';
import { 
  geocodeNominatim, 
  getRouteOSRM, 
  getRouteWithWaypoints 
} from '../utils/routeCalculations';

// Set marker icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const startIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

const endIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

function MapBoundsAdjuster({ route, startCoords, endCoords, chargingStations }) {
  const map = useMap();
  
  useEffect(() => {
    if (!route || route.length === 0) return;
    
    const bounds = L.latLngBounds([]);
    route.forEach(point => bounds.extend(point));
    if (startCoords) bounds.extend(startCoords);
    if (endCoords) bounds.extend(endCoords);
    chargingStations.forEach(station => {
      bounds.extend([station.lat, station.lng]);
    });
    
    map.fitBounds(bounds, { padding: [50, 50] });
  }, [map, route, startCoords, endCoords, chargingStations]);
  
  return null;
}

function MapView({ start, destination, range, currentRange }) {
  const [route, setRoute] = useState([]);
  const [chargingStations, setChargingStations] = useState([]);
  const [startCoords, setStartCoords] = useState(null);
  const [endCoords, setEndCoords] = useState(null);
  const [routeDistance, setRouteDistance] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isPopularRoute, setIsPopularRoute] = useState(false);
  const [tripSegments, setTripSegments] = useState([]);

  useEffect(() => {
    if (!start || !destination) return;

    const fetchData = async () => {
      setLoading(true);
      setError(null);
      
      try {
        console.log('Starting trip planning for:', start, '->', destination);
        
        const popularRoute = await checkPopularRoute(start, destination);
        const startPos = await geocodeNominatim(start);
        const destPos = await geocodeNominatim(destination);
        
        setStartCoords(startPos);
        setEndCoords(destPos);

        let finalRoute;
        let finalDistance;
        let stations = [];

        // In Mapview.jsx, update the useEffect where filterStationsForRange is called:

if (popularRoute && popularRoute.chargingStations) {
  console.log('Using popular route charging stations');
  setIsPopularRoute(true);
  
  const directRoute = await getRouteOSRM(startPos, destPos);
  
  // Check if trip is possible
  const result = filterStationsForRange(
    popularRoute.chargingStations,
    directRoute.distance,
    currentRange,
    range
  );
  
  if (!result.isPossible) {
    setError(`Trip not possible: ${result.reason}`);
    setRoute(directRoute.routeCoords);
    setRouteDistance(directRoute.distance);
    setChargingStations([]);
    setTripSegments([]);
    return;
  }
  
  stations = result.stations;
  
  const waypoints = stations.map(station => [station.lat, station.lng]);
  
  if (waypoints.length > 0) {
    const routeWithStations = await getRouteWithWaypoints(startPos, destPos, waypoints);
    finalRoute = routeWithStations.routeCoords;
    finalDistance = routeWithStations.distance;
    const segments = await calculateTripSegments(startPos, destPos, stations);
    setTripSegments(segments);
  } else {
    finalRoute = directRoute.routeCoords;
    finalDistance = directRoute.distance;
    setTripSegments([]);
  }
} else {
          console.log('Not a popular route, calculating direct route');
          const directRoute = await getRouteOSRM(startPos, destPos);
          
          if (directRoute.distance > currentRange) {
            stations = await findChargingStationsAlongRoute(
              directRoute.routeCoords,
              directRoute.distance,
              currentRange,
              range
            );
            
            const waypoints = stations.map(station => [station.lat, station.lng]);
            
            if (waypoints.length > 0) {
              const routeWithStations = await getRouteWithWaypoints(startPos, destPos, waypoints);
              finalRoute = routeWithStations.routeCoords;
              finalDistance = routeWithStations.distance;
              const segments = await calculateTripSegments(startPos, destPos, stations);
              setTripSegments(segments);
            } else {
              finalRoute = directRoute.routeCoords;
              finalDistance = directRoute.distance;
              setTripSegments([]);
            }
          } else {
            finalRoute = directRoute.routeCoords;
            finalDistance = directRoute.distance;
            setTripSegments([]);
          }
          
          setIsPopularRoute(false);
        }

        setRoute(finalRoute);
        setRouteDistance(finalDistance);
        setChargingStations(stations);

      } catch (error) {
        console.error('Error planning trip:', error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [start, destination, range, currentRange]);

  const mapCenter = startCoords || [17.385, 78.4867];

  return (
    <div className="h-full w-full relative">
      <MapContainer center={mapCenter} zoom={7} className="h-full w-full">
        <TileLayer 
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        
        {route.length > 0 && (
          <MapBoundsAdjuster 
            route={route} 
            startCoords={startCoords} 
            endCoords={endCoords}
            chargingStations={chargingStations}
          />
        )}
        
        {route.length > 0 && <Polyline positions={route} color="blue" weight={4} opacity={0.8} />}
        
        {startCoords && (
          <Marker position={startCoords} icon={startIcon}>
            <Popup>
              <div className="font-semibold">
                <strong>Start:</strong> {start}
              </div>
            </Popup>
          </Marker>
        )}

        // src/components/MapView.jsx (continued)
        {endCoords && (
          <Marker position={endCoords} icon={endIcon}>
            <Popup>
              <div className="font-semibold">
                <strong>Destination:</strong> {destination}
              </div>
            </Popup>
          </Marker>
        )}

        {chargingStations.map((station, i) => (
          <ChargingStationMarker 
            key={station._id || i} 
            station={station} 
            index={i} 
          />
        ))}
      </MapContainer>

      <TripInfoPanel 
        routeDistance={routeDistance}
        currentRange={currentRange}
        chargingStations={chargingStations}
        isPopularRoute={isPopularRoute}
        tripSegments={tripSegments}
        loading={loading}
        error={error}
      />
    </div>
  );
}

export default MapView;