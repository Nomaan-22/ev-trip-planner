import mongoose from 'mongoose';

const popularRouteSchema = new mongoose.Schema({
  routeId: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  startCity: { type: String, required: true },
  endCity: { type: String, required: true },
  keywords: [String],
  distance: Number,
  averageDuration: Number,
  chargingStations: [{
    stationId: { type: mongoose.Schema.Types.ObjectId, ref: 'ChargingStation' },
    distanceFromStart: Number,
    recommendedChargeTime: Number,
    isRequired: Boolean
  }],
  waypoints: [[Number]], // Array of [lat, lng] coordinates
  popularity: { type: Number, default: 0 },
  verified: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

const PopularRoute = mongoose.model('PopularRoute', popularRouteSchema);

export default PopularRoute;