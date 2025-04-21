const express = require('express');
const app = express();
const cookieParser = require('cookie-parser');
require('dotenv').config();
const port = process.env.PORT || 3000; 
const userRoute = require('./routes/userRoute') 
const paymentRoute = require('./routes/paymentRoutes')
const adminRoute = require('./routes/adminRoute')
const dashboardRoute = require('./routes/dashboardRoute')
const cors = require('cors');



const allowedOrigins = [
    'http://localhost:3000',
    'http://localhost:5173',
    'https://in-truck-client-px4uaenfj-hamza-bensalems-projects.vercel.app'
  ];
  
  app.use(cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (e.g., mobile apps, Postman)
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true); // Allow the origin
      } else {
        callback(new Error('Not allowed by CORS')); // Reject the request
      }
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true // Allow sending credentials (cookies)
  }));

app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));


app.use('/auth', userRoute);
app.use('/dashboard', dashboardRoute);
app.use('/payment', paymentRoute);
app.use('/admin', adminRoute);




app.listen(port, () => {
    console.log('Server is running on port ', port);
});
