const axios = require('axios');
require('dotenv').config();

const GOOGLE_API_KEY = process.env.GOOGLE_MAPS_API_KEY;

async function CalculDistance(req, res) {
  const origin = { lat: 33.5731, lng: -7.5898 }
  const destination = { lat: 34.0209, lng: -6.8416 } 

  if (!origin || !destination) {
    return res.status(400).json({ error: 'Origin and destination are required' });
  }

  try {
    const url = `https://maps.googleapis.com/maps/api/distancematrix/json?units=metric&origins=${origin.lat},${origin.lng}&destinations=${destination.lat},${destination.lng}&key=${GOOGLE_API_KEY}`;
    
    const response = await axios.get(url);
    const data = response.data;

    const element = data?.rows?.[0]?.elements?.[0];

    if (element && element.status === 'OK') {
      const distanceText = element.distance.text;
      const durationText = element.duration.text;
      const distanceKm = parseFloat(distanceText.split(' ')[0]);
      const distanceRounded = Math.round(distanceKm);
      const pricePerKm = 7;
      const PricePerKg = 2.5;
      const weight = 10; // Example weight in kg
      const quantity = 1; // Example quantity
      const price = (pricePerKm * distanceRounded) + (PricePerKg * weight * quantity);

      req.distanceData = {
        distanceText,
        distanceKm,
        distanceRounded,
        durationText,
        price:`price: ${price} dh`,
      };
      res.status(200).json(req.distanceData); // Send the distance data back in the response

      
    } else {
      res.status(400).json({ error: 'No distance found' });
    }
  } catch (error) {
    console.error('Error in CalculDistance:', error.message);
    res.status(500).json({ error: 'Error fetching distance', details: error.message });
  }
}

module.exports = {
  CalculDistance
};
