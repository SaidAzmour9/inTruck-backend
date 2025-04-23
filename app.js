const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const app = express();
const cookieParser = require('cookie-parser');
require('dotenv').config();
const port = process.env.PORT || 3000; 
const userRoute = require('./routes/userRoute');
const paymentRoute = require('./routes/paymentRoutes');
const adminRoute = require('./routes/adminRoute');
const cors = require('cors');

app.use(cors({
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
}));

app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

app.use('/auth', userRoute);
app.use('/payment', paymentRoute);
app.use('/admin', adminRoute);
app.use('/api', require('./routes/deliveryRoute'));
app.use('/api', require('./routes/trackingRoute')); 
app.use('/api', require('./routes/dashboardRoute'));
app.use('/api', require('./routes/notificationRoute'));

const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: 'http://localhost:5173',
        methods: ['GET', 'POST']
    }
});

io.on('connection', (socket) => {
    console.log('a user connected: ' + socket.id);

    socket.on('disconnect', () => {
        console.log('user disconnected: ' + socket.id);
    });
});

server.listen(port, () => {
    console.log('Server is running on port ', port);
});

module.exports = { app, io };
