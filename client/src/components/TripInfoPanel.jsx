// src/components/TripInfoPanel.jsx
function TripInfoPanel({ 
  routeDistance, 
  currentRange, 
  chargingStations, 
  isPopularRoute, 
  tripSegments, 
  loading, 
  error 
}) {
  return (
    <div className="absolute top-4 right-4 bg-white p-4 rounded-lg shadow-lg z-[1000] max-w-sm">
      <h3 className="font-bold text-lg mb-3">Trip Summary</h3>
      
      <div className="space-y-2">
        <div className="flex justify-between">
          <span className="text-sm text-gray-600">Total Distance:</span>
          <span className="text-sm font-semibold">{routeDistance.toFixed(1)} km</span>
        </div>
        
        <div className="flex justify-between">
          <span className="text-sm text-gray-600">Current Range:</span>
          <span className="text-sm font-semibold">{currentRange} km</span>
        </div>
        
        <div className="flex justify-between">
          <span className="text-sm text-gray-600">Charging Stops:</span>
          <span className="text-sm font-semibold">{chargingStations.length}</span>
        </div>
        
        {error && (
          <div className="bg-red-50 border border-red-200 p-3 rounded-lg mt-3">
            <div className="flex items-start">
              <span className="text-red-600 text-lg mr-2">⚠️</span>
              <div>
                <p className="text-sm font-semibold text-red-800">Trip Not Possible</p>
                <p className="text-xs text-red-700 mt-1">{error}</p>
                <p className="text-xs text-red-600 mt-2">
                  Suggestions:
                  <ul className="list-disc list-inside mt-1">
                    <li>Start with a higher battery charge</li>
                    <li>Consider a vehicle with longer range</li>
                    <li>Plan an overnight stop for charging</li>
                  </ul>
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Only show other info if no error */}
        {!error && (
          <>
            {routeDistance > currentRange && (
              <div className="bg-yellow-50 p-2 rounded text-xs text-yellow-800 mt-2">
                ⚡ This trip requires charging stops
              </div>
            )}
            
            {isPopularRoute && (
              <div className="bg-green-50 p-2 rounded text-xs text-green-800">
                ✓ Popular route with verified stations
              </div>
            )}
            
            {tripSegments.length > 0 && (
              <div className="mt-3 pt-3 border-t">
                <h4 className="text-sm font-semibold mb-2">Trip Segments:</h4>
                <div className="space-y-1 text-xs">
                  {tripSegments.map((segment, idx) => (
                    <div key={idx} className="flex flex-col">
                      <div className="flex justify-between">
                        <span className="text-gray-600">{segment.from} → {segment.to}</span>
                        <span className="font-medium">{segment.distance.toFixed(1)} km</span>
                      </div>
                      {segment.rangeAtArrival && (
                        <span className="text-gray-500 text-xs ml-2">{segment.rangeAtArrival}</span>
                      )}
                    </div>
                  ))}
                </div>
                <div className="mt-2 pt-2 border-t text-xs text-gray-600">
                  <p>Total stops needed: {chargingStations.length}</p>
                  <p>Estimated charging time: ~{chargingStations.reduce((sum, s) => 
                    sum + (s.recommendedChargeTime || 30), 0)} minutes</p>
                </div>
              </div>
            )}
            
            {chargingStations.length > 0 && (
              <div className="text-xs text-gray-500 mt-2">
                {chargingStations.some(s => s.dataProvider === 'OpenChargeMap') && (
                  <p>* Some stations from OpenChargeMap</p>
                )}
                {chargingStations.some(s => s.isEmergencyOption) && (
                  <p className="text-orange-600">⚠️ Route includes emergency charging options</p>
                )}
              </div>
            )}
          </>
        )}
        
        {loading && (
          <div className="flex items-center justify-center mt-3">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
            <span className="ml-2 text-sm text-blue-600">Planning route...</span>
          </div>
        )}
      </div>
    </div>
  );
}

export default TripInfoPanel;