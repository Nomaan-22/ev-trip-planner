// src/components/ChargingStationMarker.jsx
import { Marker, Popup } from 'react-leaflet';
import L from 'leaflet';

const chargingIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

function ChargingStationMarker({ station, index }) {
  return (
    <Marker 
      position={[station.lat, station.lng]} 
      icon={chargingIcon}
    >
      <Popup maxWidth={300}>
        <div className="p-2">
          <h4 className="font-bold text-lg mb-1">{station.name || 'EV Charging Station'}</h4>
          {station.address && (
            <p className="text-sm text-gray-700 mb-1">{station.address}</p>
          )}
          <div className="bg-green-50 p-2 rounded mb-2">
            <p className="text-sm font-semibold text-green-800">
              Charging Stop #{index + 1}
            </p>
            {station.rangeNeeded && (
              <p className="text-xs text-green-700">
                Range to reach: ~{station.rangeNeeded.toFixed(0)} km
              </p>
            )}
            {station.recommendedChargeTime && (
              <p className="text-xs text-green-700">
                Recommended charge: {station.recommendedChargeTime} min
              </p>
            )}
           // src/components/ChargingStationMarker.jsx (continued)
            {station.detourDistance && station.detourDistance > 5 && (
              <p className="text-xs text-orange-600">
                Detour: +{station.detourDistance.toFixed(1)} km
              </p>
            )}
          </div>
          
          {station.provider && (
            <p className="text-sm text-gray-600 mb-1">
              <span className="font-semibold">Provider:</span> {station.provider}
            </p>
          )}
          
          {station.connectors && station.connectors.length > 0 && (
            <div className="mb-2">
              <p className="text-sm font-semibold mb-1">Connectors:</p>
              <div className="text-xs space-y-1">
                {station.connectors.map((c, idx) => (
                  <div key={idx} className="bg-gray-100 p-1 rounded flex justify-between items-center">
                    <span>{c.type} - {c.power}kW {c.count > 1 && `(${c.count} ports)`}</span>
                    {c.status && c.status !== 'Unknown' && (
                      <span className={`text-xs px-1 rounded ${
                        c.status.includes('Operational') ? 'bg-green-200 text-green-800' : 
                        'bg-yellow-200 text-yellow-800'
                      }`}>
                        {c.status}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {station.amenities && station.amenities.length > 0 && (
            <p className="text-xs text-gray-600">
              <span className="font-semibold">Amenities:</span> {station.amenities.join(', ')}
            </p>
          )}
          
          {station.access && (
            <p className="text-xs text-gray-600">
              <span className="font-semibold">Access:</span> {station.access}
            </p>
          )}
          
          {station.verified && (
            <p className="text-xs text-green-600 mt-1">
              ✓ Verified location
            </p>
          )}
          
          {station.dataProvider && (
            <p className="text-xs text-gray-500 italic mt-1">
              Data from: {station.dataProvider}
            </p>
          )}
          
          {station.isEmergencyOption && (
            <p className="text-xs text-orange-600 font-semibold mt-1">
              ⚠️ Emergency option - may require detour
            </p>
          )}
        </div>
      </Popup>
    </Marker>
  );
}

export default ChargingStationMarker;