import mongoose from 'mongoose';
import dotenv from 'dotenv';
import ChargingStation from '../models/ChargingStation.js';
import PopularRoute from '../models/PopularRoute.js';

dotenv.config();

const seedDatabase = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/ev-trip-planner');
    console.log('Connected to MongoDB');

    // Clear existing data
    await ChargingStation.deleteMany({});
    await PopularRoute.deleteMany({});
    console.log('Cleared existing data');

    // Seed charging stations with accurate highway coordinates
    const stations = await ChargingStation.insertMany([
      // Bangalore to Chennai Route Stations (NH48)
      {
        name: 'Ather Grid - Hoskote',
        location: { type: 'Point', coordinates: [77.7981, 13.0709] },
        address: 'NH-75, Hoskote, Karnataka',
        city: 'Hoskote',
        state: 'Karnataka',
        connectors: [{ type: 'CCS2', power: 50, count: 1 }, { type: 'Type 2', power: 7.4, count: 2 }],
        provider: 'Ather',
        amenities: ['Parking'],
        access: '24/7',
        verified: true
      },
      {
        name: 'ChargeZone - Kolar',
        location: { type: 'Point', coordinates: [78.1302, 13.1378] },
        address: 'Kolar Bus Stand, NH-75, Karnataka',
        city: 'Kolar',
        state: 'Karnataka',
        connectors: [{ type: 'CCS2', power: 100, count: 2 }, { type: 'Type 2', power: 22, count: 2 }],
        provider: 'ChargeZone',
        amenities: ['Restroom', 'Food', 'Parking'],
        access: '24/7',
        verified: true
      },
      {
        name: 'Statiq Charging Station - Krishnagiri',
        location: { type: 'Point', coordinates: [78.1880, 12.5180] },
        address: 'NH44, Near Krishnagiri Toll Plaza',
        city: 'Krishnagiri',
        state: 'Tamil Nadu',
        connectors: [{ type: 'CCS2', power: 50, count: 2 }, { type: 'Type 2', power: 22, count: 2 }],
        provider: 'Statiq',
        amenities: ['Restroom', 'Restaurant', 'WiFi', 'Parking'],
        access: '24/7',
        verified: true
      },
      {
        name: 'ChargeZone - Vellore',
        location: { type: 'Point', coordinates: [79.1105, 12.9565] },
        address: 'NH48, Vellore Bypass',
        city: 'Vellore',
        state: 'Tamil Nadu',
        connectors: [{ type: 'CCS2', power: 60, count: 2 }, { type: 'Type 2', power: 22, count: 2 }],
        provider: 'ChargeZone',
        amenities: ['Food Court', 'Restroom', 'Parking'],
        access: '24/7',
        verified: true
      },
      {
        name: 'Relux Charging Station - Ranipet',
        location: { type: 'Point', coordinates: [79.3420, 12.9240] },
        address: 'NH48, Ranipet',
        city: 'Ranipet',
        state: 'Tamil Nadu',
        connectors: [{ type: 'CCS2', power: 50, count: 1 }, { type: 'CHAdeMO', power: 50, count: 1 }],
        provider: 'Relux',
        amenities: ['Restroom', 'Parking'],
        access: '24/7',
        verified: true
      },
      {
        name: 'Tata Power - Sriperumbudur',
        location: { type: 'Point', coordinates: [79.9543, 12.9636] },
        address: 'NH48, Near Sriperumbudur',
        city: 'Sriperumbudur',
        state: 'Tamil Nadu',
        connectors: [{ type: 'CCS2', power: 50, count: 2 }, { type: 'Type 2', power: 22, count: 2 }],
        provider: 'Tata Power',
        amenities: ['Parking', 'Restaurant'],
        access: '24/7',
        verified: true
      },

      // Delhi to Bhopal Route Stations (NH44 South)
      {
        name: 'Tata Power - DLF CyberHub',
        location: { type: 'Point', coordinates: [77.0883, 28.4957] },
        address: 'DLF CyberHub, Sector 24, Gurugram, Haryana',
        city: 'Gurugram',
        state: 'Haryana',
        connectors: [{ type: 'CCS2', power: 50, count: 2 }, { type: 'Type 2', power: 22, count: 2 }],
        provider: 'Tata Power',
        amenities: ['Restroom', 'Food Court', 'WiFi', 'Parking'],
        access: '24/7',
        verified: true
      },
      {
        name: 'ChargeZone - Agra',
        location: { type: 'Point', coordinates: [78.0058, 27.1767] },
        address: 'NH44, Near Sikandra, Agra',
        city: 'Agra',
        state: 'Uttar Pradesh',
        connectors: [{ type: 'CCS2', power: 60, count: 2 }, { type: 'Type 2', power: 22, count: 2 }],
        provider: 'ChargeZone',
        amenities: ['Parking', 'Restroom', 'Food'],
        access: '24/7',
        verified: true
      },
      {
        name: 'Jio-BP - Gwalior',
        location: { type: 'Point', coordinates: [78.1828, 26.2183] },
        address: 'NH44, Gwalior',
        city: 'Gwalior',
        state: 'Madhya Pradesh',
        connectors: [{ type: 'CCS2', power: 100, count: 2 }, { type: 'CHAdeMO', power: 50, count: 1 }],
        provider: 'Jio-BP',
        amenities: ['Restroom', 'Convenience Store', 'Parking'],
        access: '24/7',
        verified: true
      },

      // Delhi to Jammu Route Stations (NH44 North)
      {
        name: 'Statiq - Haveli Murthal',
        location: { type: 'Point', coordinates: [77.0620, 29.0420] },
        address: 'NH44, Murthal, Haryana',
        city: 'Murthal',
        state: 'Haryana',
        connectors: [{ type: 'CCS2', power: 60, count: 2 }, { type: 'Type 2', power: 22, count: 4 }],
        provider: 'Statiq',
        amenities: ['Restaurant', 'Restroom', 'Food Court', 'Parking'],
        access: '24/7',
        verified: true
      },
      {
        name: 'Tata Power - Karnal',
        location: { type: 'Point', coordinates: [76.9904, 29.6857] },
        address: 'NH44, Karnal Bypass',
        city: 'Karnal',
        state: 'Haryana',
        connectors: [{ type: 'CCS2', power: 50, count: 2 }, { type: 'Type 2', power: 22, count: 2 }],
        provider: 'Tata Power',
        amenities: ['Restroom', 'Parking'],
        access: '24/7',
        verified: true
      },
      {
        name: 'Statiq - Ambala',
        location: { type: 'Point', coordinates: [76.7773, 30.3782] },
        address: 'NH44, Ambala Cantt',
        city: 'Ambala',
        state: 'Haryana',
        connectors: [{ type: 'CCS2', power: 60, count: 2 }, { type: 'Type 2', power: 22, count: 2 }],
        provider: 'Statiq',
        amenities: ['Hotel', 'Restaurant', 'WiFi', 'Parking'],
        access: '24/7',
        verified: true
      },
      {
        name: 'Tata Power - Ludhiana',
        location: { type: 'Point', coordinates: [75.8573, 30.9010] },
        address: 'NH44, Near Ludhiana',
        city: 'Ludhiana',
        state: 'Punjab',
        connectors: [{ type: 'CCS2', power: 50, count: 2 }, { type: 'CHAdeMO', power: 50, count: 1 }],
        provider: 'Tata Power',
        amenities: ['Restroom', 'Convenience Store', 'Parking'],
        access: '24/7',
        verified: true
      },
      {
        name: 'ChargeZone - Jalandhar',
        location: { type: 'Point', coordinates: [75.5761, 31.3260] },
        address: 'NH44, GT Road, Jalandhar',
        city: 'Jalandhar',
        state: 'Punjab',
        connectors: [{ type: 'CCS2', power: 60, count: 2 }, { type: 'Type 2', power: 22, count: 2 }],
        provider: 'ChargeZone',
        amenities: ['Restaurant', 'Restroom', 'Parking'],
        access: '24/7',
        verified: true
      },
      {
        name: 'Tata Power - Pathankot',
        location: { type: 'Point', coordinates: [75.6541, 32.2643] },
        address: 'NH44, Pathankot',
        city: 'Pathankot',
        state: 'Punjab',
        connectors: [{ type: 'CCS2', power: 50, count: 2 }, { type: 'Type 2', power: 22, count: 2 }],
        provider: 'Tata Power',
        amenities: ['Parking', 'Restroom'],
        access: '24/7',
        verified: true
      },

      // Hyderabad to Goa Route Stations
      {
        name: 'GLIDA - Shamshabad',
        location: { type: 'Point', coordinates: [78.4083, 17.2487] },
        address: 'NH44, Near Airport, Shamshabad',
        city: 'Hyderabad',
        state: 'Telangana',
        connectors: [{ type: 'CCS2', power: 120, count: 4 }, { type: 'Type 2', power: 22, count: 4 }],
        provider: 'GLIDA/Statiq',
        amenities: ['Restroom', 'WiFi', 'Lounge', 'Parking'],
        access: '24/7',
        verified: true
      },
      {
        name: 'ChargeZone - Zaheerabad',
        location: { type: 'Point', coordinates: [77.6078, 17.6773] },
        address: 'NH65, Zaheerabad',
        city: 'Zaheerabad',
        state: 'Telangana',
        connectors: [{ type: 'CCS2', power: 60, count: 2 }, { type: 'Type 2', power: 22, count: 2 }],
        provider: 'ChargeZone',
        amenities: ['Restaurant', 'Restroom', 'Parking'],
        access: '24/7',
        verified: true
      },
      {
        name: 'Tata Power - Solapur',
        location: { type: 'Point', coordinates: [75.9064, 17.6599] },
        address: 'NH65, Solapur',
        city: 'Solapur',
        state: 'Maharashtra',
        connectors: [{ type: 'CCS2', power: 50, count: 2 }, { type: 'Type 2', power: 22, count: 2 }],
        provider: 'Tata Power',
        amenities: ['Hotel', 'Restaurant', 'Restroom', 'Parking'],
        access: '24/7',
        verified: true
      },
      {
        name: 'Zeon Charging - Kolhapur',
        location: { type: 'Point', coordinates: [74.2433, 16.7050] },
        address: 'NH48, Kolhapur',
        city: 'Kolhapur',
        state: 'Maharashtra',
        connectors: [{ type: 'CCS2', power: 60, count: 2 }, { type: 'Type 2', power: 22, count: 2 }],
        provider: 'Zeon',
        amenities: ['Food Court', 'Restroom', 'Parking'],
        access: '24/7',
        verified: true
      },
      {
        name: 'Statiq - Belgaum',
        location: { type: 'Point', coordinates: [74.5088, 15.8497] },
        address: 'NH48, Belgaum',
        city: 'Belgaum',
        state: 'Karnataka',
        connectors: [{ type: 'CCS2', power: 50, count: 2 }, { type: 'Type 2', power: 22, count: 2 }],
        provider: 'Statiq',
        amenities: ['Hotel', 'Restaurant', 'WiFi', 'Parking'],
        access: '24/7',
        verified: true
      },

      // Hyderabad to Bangalore Route Stations (NH44)
      {
        name: 'Jio-BP - Jadcherla',
        location: { type: 'Point', coordinates: [78.1369, 16.7605] },
        address: 'NH44, Jadcherla',
        city: 'Jadcherla',
        state: 'Telangana',
        connectors: [{ type: 'CCS2', power: 60, count: 2 }, { type: 'CHAdeMO', power: 50, count: 1 }],
        provider: 'Jio-BP/ChargeZone',
        amenities: ['Food Court', 'Restroom', 'Parking'],
        access: '24/7',
        verified: true
      },
      {
        name: 'Tata Power - Kurnool',
        location: { type: 'Point', coordinates: [78.0373, 15.8281] },
        address: 'NH44, Kurnool',
        city: 'Kurnool',
        state: 'Andhra Pradesh',
        connectors: [{ type: 'CCS2', power: 50, count: 2 }, { type: 'Type 2', power: 22, count: 2 }],
        provider: 'Tata Power',
        amenities: ['Restaurant', 'Restroom', 'Parking'],
        access: '24/7',
        verified: true
      },
      {
        name: 'ChargeZone - Anantapur',
        location: { type: 'Point', coordinates: [77.6006, 14.6819] },
        address: 'NH44, Near Anantapur',
        city: 'Anantapur',
        state: 'Andhra Pradesh',
        connectors: [{ type: 'CCS2', power: 60, count: 3 }, { type: 'Type 2', power: 22, count: 3 }, { type: 'CHAdeMO', power: 50, count: 1 }],
        provider: 'ChargeZone/Tata Power',
        amenities: ['Restaurant', 'Restroom', 'WiFi', 'Parking', 'Lounge'],
        access: '24/7',
        verified: true
      },
      {
        name: 'Shell Recharge - Devanahalli',
        location: { type: 'Point', coordinates: [77.7119, 13.2477] },
        address: 'NH44, Devanahalli',
        city: 'Devanahalli',
        state: 'Karnataka',
        connectors: [{ type: 'CCS2', power: 100, count: 2 }, { type: 'CHAdeMO', power: 50, count: 1 }],
        provider: 'Shell Recharge',
        amenities: ['Convenience Store', 'Restroom', 'Cafe', 'Parking'],
        access: '24/7',
        verified: true
      }
    ]);

    console.log(`Seeded ${stations.length} charging stations`);

    // Create a map of stations by name for easy reference
    const stationMap = {};
    stations.forEach(station => {
      stationMap[station.name] = station._id;
    });

    // Seed popular routes with updated station references
    const routes = await PopularRoute.insertMany([
      {
        routeId: 'bangalore-chennai',
        name: 'Bangalore to Chennai',
        startCity: 'Bangalore',
        endCity: 'Chennai',
        keywords: ['bangalore', 'bengaluru', 'chennai', 'madras'],
        distance: 350,
        averageDuration: 6,
        chargingStations: [
          { stationId: stationMap['Ather Grid - Hoskote'], distanceFromStart: 35, isRequired: false },
          { stationId: stationMap['ChargeZone - Kolar'], distanceFromStart: 70, isRequired: true },
          { stationId: stationMap['Statiq Charging Station - Krishnagiri'], distanceFromStart: 120, isRequired: true },
          { stationId: stationMap['ChargeZone - Vellore'], distanceFromStart: 180, isRequired: true },
          { stationId: stationMap['Relux Charging Station - Ranipet'], distanceFromStart: 210, isRequired: false },
          { stationId: stationMap['Tata Power - Sriperumbudur'], distanceFromStart: 280, isRequired: true },
        ],
        verified: true,
        popularity: 250
      },
      {
        routeId: 'chennai-bangalore',
        name: 'Chennai to Bangalore',
        startCity: 'Chennai',
        endCity: 'Bangalore',
        keywords: ['chennai', 'madras', 'bangalore', 'bengaluru'],
        distance: 350,
        averageDuration: 6,
        chargingStations: [
          { stationId: stationMap['Tata Power - Sriperumbudur'], distanceFromStart: 70, isRequired: true },
          { stationId: stationMap['Relux Charging Station - Ranipet'], distanceFromStart: 130, isRequired: false },
          { stationId: stationMap['ChargeZone - Vellore'], distanceFromStart: 170, isRequired: true },
          { stationId: stationMap['Statiq Charging Station - Krishnagiri'], distanceFromStart: 250, isRequired: true },
          { stationId: stationMap['ChargeZone - Kolar'], distanceFromStart: 280, isRequired: false },
          { stationId: stationMap['Ather Grid - Hoskote'], distanceFromStart: 315, isRequired: true }
        ],
        verified: true,
        popularity: 250
      },
      {
        routeId: 'delhi-bhopal',
        name: 'Delhi to Bhopal',
        startCity: 'Delhi',
        endCity: 'Bhopal',
        keywords: ['delhi', 'new delhi', 'gurugram', 'bhopal'],
        distance: 780,
        averageDuration: 13,
        chargingStations: [
          { stationId: stationMap['Tata Power - DLF CyberHub'], distanceFromStart: 30, isRequired: false },
          { stationId: stationMap['ChargeZone - Agra'], distanceFromStart: 230, isRequired: true },
          { stationId: stationMap['Jio-BP - Gwalior'], distanceFromStart: 350, isRequired: true }
        ],
        verified: true,
        popularity: 150
      },
      {
        routeId: 'delhi-jammu',
        name: 'Delhi to Jammu',
        startCity: 'Delhi',
        endCity: 'Jammu',
        keywords: ['delhi', 'new delhi', 'dilli', 'jammu', 'jammu city'],
        distance: 586,
        averageDuration: 10,
        chargingStations: [
          { stationId: stationMap['Statiq - Haveli Murthal'], distanceFromStart: 50, isRequired: false },
          { stationId: stationMap['Tata Power - Karnal'], distanceFromStart: 125, isRequired: true },
          { stationId: stationMap['Statiq - Ambala'], distanceFromStart: 200, isRequired: true },
          { stationId: stationMap['Tata Power - Ludhiana'], distanceFromStart: 310, isRequired: true },
          { stationId: stationMap['ChargeZone - Jalandhar'], distanceFromStart: 370, isRequired: true },
          { stationId: stationMap['Tata Power - Pathankot'], distanceFromStart: 480, isRequired: true }
        ],
        verified: true,
        popularity: 200
      },
      {
        routeId: 'hyderabad-goa',
        name: 'Hyderabad to Goa',
        startCity: 'Hyderabad',
        endCity: 'Goa',
        keywords: ['hyderabad', 'cyberabad', 'goa', 'panaji', 'panjim', 'margao', 'vasco'],
        distance: 700,
        averageDuration: 12,
        chargingStations: [
          { stationId: stationMap['GLIDA - Shamshabad'], distanceFromStart: 40, isRequired: false },
          { stationId: stationMap['ChargeZone - Zaheerabad'], distanceFromStart: 120, isRequired: true },
          { stationId: stationMap['Tata Power - Solapur'], distanceFromStart: 300, isRequired: true },
          { stationId: stationMap['Zeon Charging - Kolhapur'], distanceFromStart: 550, isRequired: true },
          { stationId: stationMap['Statiq - Belgaum'], distanceFromStart: 650, isRequired: true }
        ],
        verified: true,
        popularity: 160
      },
      {
        routeId: 'hyderabad-bangalore',
        name: 'Hyderabad to Bangalore',
        startCity: 'Hyderabad',
        endCity: 'Bangalore',
        keywords: ['hyderabad', 'bangalore', 'bengaluru'],
        distance: 575,
        averageDuration: 9,
        chargingStations: [
            { stationId: stationMap['Jio-BP - Jadcherla'], distanceFromStart: 90, isRequired: true },
            { stationId: stationMap['Tata Power - Kurnool'], distanceFromStart: 220, isRequired: true },
            { stationId: stationMap['ChargeZone - Anantapur'], distanceFromStart: 400, isRequired: true },
            { stationId: stationMap['Shell Recharge - Devanahalli'], distanceFromStart: 540, isRequired: true }
        ],
        verified: true,
        popularity: 180
      }
    ]);

    console.log(`Seeded ${routes.length} popular routes`);
    console.log('Database seeding completed successfully!');

  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    // Close the connection
    await mongoose.connection.close();
    console.log('Database connection closed');
  }
};

// Run the seed function
seedDatabase();