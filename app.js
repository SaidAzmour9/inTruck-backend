const express = require('express');
const app = express();
const cookieParser = require('cookie-parser');
require('dotenv').config();
const port = process.env.PORT || 3000; 
const userRoute = require('./routes/userRoute') 
const paymentRoute = require('./routes/paymentRoutes')
const cors = require('cors');


app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
}));


app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));


app.use('/auth', userRoute);
app.use('/payment', paymentRoute);


app.listen(port, () => {
    console.log('Server is running on port ', port);
});
