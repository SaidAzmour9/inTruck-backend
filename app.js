const express = require('express');
const app = express();
require('dotenv').config();
const port = process.env.PORT || 3000; 
const rateLimit = require('express-rate-limit');
const userRoute = require('./routes/userRoute') 
const paymentRoute = require('./routes/paymentRoutes')
const adminRoute = require('./routes/adminRoute')
const dashboardRoute = require('./routes/dashboardRoute')
const cors = require('cors');

app.set('trust proxy', 1); 


const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 100, 
    standardHeaders: 'draft-8', 
    legacyHeaders: false, 
});
app.use(limiter);

app.use(cors({
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: false // No need for credentials since we're not using cookies
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/auth', userRoute);
app.use('/dashboard', dashboardRoute);
app.use('/payment', paymentRoute);
app.use('/admin', adminRoute);

app.listen(port, () => {
    console.log('Server is running on port ', port);
});
