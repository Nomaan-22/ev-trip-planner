import mongoose from 'mongoose';

const chargingStationSchema = new mongoose.Schema({
  name: { type: String, required: true },
  location: {
    type: { type: String, enum: ['Point'], default: 'Point' },
    coordinates: { type: [Number], required: true } // [longitude, latitude]
  },
  address: { type: String, required: true },
  city: String,
  state: String,
  connectors: [{
    type: { type: String, required: true },
    power: { type: Number, required: true },
    count: { type: Number, default: 1 }
  }],
  provider: String,
  access: { type: String, default: '24/7' },
  amenities: [String],
  verified: { type: Boolean, default: false },
  ratings: {
    average: { type: Number, default: 0 },
    count: { type: Number, default: 0 }
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Create geospatial index for location queries
chargingStationSchema.index({ location: '2dsphere' });

const ChargingStation = mongoose.model('ChargingStation', chargingStationSchema);

export default ChargingStation;