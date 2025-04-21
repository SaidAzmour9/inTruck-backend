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



app.use(cors({
    origin: ['*', 'http://localhost:5173', 'https://in-truck-client-px4uaenfj-hamza-bensalems-projects.vercel.app'],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
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
