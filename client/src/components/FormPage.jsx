import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import './FormPage.css'; // Include custom CSS for enhancements

function FormPage() {
  const [start, setStart] = useState('');
  const [destination, setDestination] = useState('');
  const [range, setRange] = useState(300);
  const [currentRange, setCurrentRange] = useState(200);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    navigate('/map', {
      state: {
        start,
        destination,
        range,
        currentRange
      }
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 to-white px-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md space-y-6 border-t-4 border-blue-600 animate-fade"
      >
        <h2 className="text-3xl font-bold text-center text-blue-700">EV Trip Planner</h2>

        <div>
          <label className="block text-sm font-semibold mb-1 text-gray-700">Start Location</label>
          <input
            type="text"
            value={start}
            onChange={(e) => setStart(e.target.value)}
            placeholder="e.g., Hyderabad"
            className="input-field"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-semibold mb-1 text-gray-700">Destination</label>
          <input
            type="text"
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
            placeholder="e.g., Bengaluru"
            className="input-field"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-semibold mb-1 text-gray-700">Full Battery Range (in km)</label>
          <input
            type="number"
            value={range}
            onChange={(e) => setRange(e.target.value)}
            placeholder="e.g., 300"
            className="input-field"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold mb-1 text-gray-700">Current Battery Range (in km)</label>
          <input
            type="number"
            value={currentRange}
            onChange={(e) => setCurrentRange(e.target.value)}
            placeholder="e.g., 200"
            className="input-field"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white font-semibold py-2 rounded-xl hover:bg-blue-700 transition duration-300"
        >
          Plan Trip
        </button>
      </form>
    </div>
  );
}

export default FormPage;
