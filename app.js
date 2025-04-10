const express = require('express');
const app = express();
const cookieParser = require('cookie-parser');
require('dotenv').config();
const port = process.env.PORT || 3000; 
const userRoute = require('./routes/userRoute') 
const paymentRoute = require('./routes/paymentRoutes')
const cors = require('cors');



app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));



app.use('/auth',userRoute);
app.use('/payment',paymentRoute)

app.use(cors({
    origin: ['http://localhost:3000', 'http://localhost:5173'],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
  }));

// const GOOGLE_API_KEY = process.env.GOOGLE_MAPS_API_KEY;
// app.post('/distance', async (req, res) => {
//   const { origin, destination } = req.body;
//   try {
//     const url = `https://maps.googleapis.com/maps/api/distancematrix/json?units=metric&origins=${origin.lat},${origin.lng}&destinations=${destination.lat},${destination.lng}&key=${GOOGLE_API_KEY}`;
    
//     const response = await axios.get(url);
//     const data = response.data;

//     if (data.rows[0].elements[0].status === 'OK') {
//         const distanceText = data.rows[0].elements[0].distance.text;
//         const durationText = data.rows[0].elements[0].duration.text;
//         const distanceKm = parseFloat(distanceText.split(' ')[0]);
//         const distanceRounded = Math.round(distanceKm); 

//       res.json({
//         distanceText,       
//         distanceKm,          
//         distanceRounded,    
//         durationText
//       });
//     } else {
//       res.status(400).json({ error: 'No distance found' });
//     }
//   } catch (error) {
//     res.status(500).json({ error: 'Error fetching distance' });
//   }
// });




app.listen(port,()=>{
    console.log('Server is running on port ',port);
})

