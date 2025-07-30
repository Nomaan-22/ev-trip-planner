//MapPage.jsx
import { useLocation } from 'react-router-dom';
import MapView from './Mapview.jsx';

function MapPage() {
  const { state } = useLocation();

  if (!state) return (
    <div className="flex items-center justify-center h-screen text-xl text-red-600 font-semibold">
      No trip details found.
    </div>
  );

  return (
    <div className="h-screen w-full flex flex-col">
      <div className="bg-blue-700 text-white text-center p-4 shadow-md">
        <h2 className="text-2xl font-semibold">Your EV Trip Route</h2>
        <p className="text-sm mt-1">{state.start} ➡ {state.destination}</p>
      </div>
      <div className="flex-grow">
        <MapView
          start={state.start}
          destination={state.destination}
          range={parseFloat(state.range)}
          currentRange={parseFloat(state.currentRange)}
        />
      </div>
    </div>
  );
}

export default MapPage;
