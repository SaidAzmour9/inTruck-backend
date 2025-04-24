const express = require('express');
const app = express();
const cookieParser = require('cookie-parser');
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
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limite chaque IP à 100 requêtes par fenêtre
});

app.use(limiter);

const allowedOrigins = [
  'http://localhost:5173',
  'https://intruck-frontend.vercel.app'
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
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
