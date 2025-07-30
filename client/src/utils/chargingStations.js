// src/utils/chargingStations.js
export const OPEN_CHARGE_MAP_API_KEY = 'a51acbe5-1722-43b1-87f9-ec4beba34672';
export const OPEN_CHARGE_MAP_BASE_URL = 'https://api.openchargemap.io/v3/poi';
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// OpenChargeMap helpers
export function formatAddress(addressInfo) {
  const parts = [];
  if (addressInfo.AddressLine1) parts.push(addressInfo.AddressLine1);
  if (addressInfo.AddressLine2) parts.push(addressInfo.AddressLine2);
  if (addressInfo.Town) parts.push(addressInfo.Town);
  if (addressInfo.StateOrProvince) parts.push(addressInfo.StateOrProvince);
  return parts.join(', ');
}

export function mapConnectors(connections) {
  if (!connections || connections.length === 0) return [];
  
  return connections.map(conn => ({
    type: conn.ConnectionType?.Title || 'Unknown',
    power: conn.PowerKW || 0,
    count: conn.Quantity || 1,
    status: conn.StatusType?.Title || 'Unknown'
  })).filter(c => c.power > 0);
}

export function extractAmenities(station) {
  const amenities = [];
  if (station.AddressInfo?.AccessComments?.toLowerCase().includes('restaurant')) {
    amenities.push('Restaurant');
  }
  if (station.AddressInfo?.AccessComments?.toLowerCase().includes('restroom')) {
    amenities.push('Restroom');
  }
  if (station.AddressInfo?.AccessComments?.toLowerCase().includes('wifi')) {
    amenities.push('WiFi');
  }
  amenities.push('Parking');
  return amenities;
}

export async function fetchOpenChargeMapStations(lat, lng, radius = 50) {
  try {
    const params = new URLSearchParams({
      key: OPEN_CHARGE_MAP_API_KEY,
      latitude: lat,
      longitude: lng,
      distance: radius,
      distanceunit: 'KM',
      maxresults: 50,
      compact: true,
      verbose: false,
      output: 'json',
      countrycode: 'IN',
      statustypeid: '50,75',
      levelid: '2,3',
    });

    const response = await fetch(`${OPEN_CHARGE_MAP_BASE_URL}?${params}`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch from OpenChargeMap');
    }
    
    const data = await response.json();
    
    return data.map(station => ({
      _id: `ocm_${station.ID}`,
      lat: station.AddressInfo.Latitude,
      lng: station.AddressInfo.Longitude,
      name: station.AddressInfo.Title || `Charging Station ${station.ID}`,
      address: formatAddress(station.AddressInfo),
      provider: station.OperatorInfo?.Title || 'Unknown',
      connectors: mapConnectors(station.Connections),
      amenities: extractAmenities(station),
      access: station.UsageType?.Title || '24/7',
      dataProvider: 'OpenChargeMap',
      verified: station.IsRecentlyVerified || false
    }));
  } catch (error) {
    console.error('Error fetching from OpenChargeMap:', error);
    return [];
  }
}

export async function fetchNearbyStations(lat, lng, radius = 50) {
  try {
    const response = await fetch(
      `${API_BASE_URL}/charging-stations/nearby?lat=${lat}&lng=${lng}&radius=${radius * 1000}`
    );
    
    if (!response.ok) {
      throw new Error('Failed to fetch stations');
    }
    
    const stations = await response.json();
    
    return stations.map(station => ({
      _id: station._id,
      lat: station.location.coordinates[1],
      lng: station.location.coordinates[0],
      name: station.name,
      address: station.address,
      provider: station.provider,
      connectors: station.connectors,
      amenities: station.amenities,
      access: station.access
    }));
  } catch (error) {
    console.error('Error fetching stations:', error);
    return [];
  }
}