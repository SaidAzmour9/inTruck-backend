const express = require('express');
const axios = require('axios');
const app = express();
app.use(express.json());
require('dotenv').config();

app.post('/distance', async (req, res,next) => {
    const { origin, destination } = req.body;
  
    try {
    const url = `https://maps.googleapis.com/maps/api/distancematrix/json?units=metric&origins=${origin.lat},${origin.lng}&destinations=${destination.lat},${destination.lng}&key=${GOOGLE_API_KEY}`;
      
      const response = await axios.get(url);
      const data = response.data;
  
      const element = data.rows[0].elements[0];
  
      if (element.status === 'OK') {
        const distanceText = element.distance.text; // e.g. "89.0 km"
        const durationText = element.duration.text;
  
        // استخراج الرقم فقط من distance
        const distanceKm = parseFloat(distanceText.split(' ')[0]); // => 89.0
        const distanceRounded = Math.round(distanceKm); // => 89
  
        res.json({
          distanceText,       // "89.0 km"
          distanceKm,         // 89.0
          distanceRounded,    // 89
          durationText        // "1 hour 9 mins"
        });
        next();
      } else {
        res.status(400).json({ error: 'No distance found' });
      }
    } catch (error) {
      res.status(500).json({ error: 'Error fetching distance' });
    }
  });
  