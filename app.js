const express = require('express');
const app = express();
const cookieParser = require('cookie-parser');
require('dotenv').config();
const port = process.env.PORT || 3000; 
const userRoute = require('./routes/userRoute') 



app.use(express.json());
app.use(cookieParser());

app.use('/users',userRoute);




app.listen(port,()=>{
    console.log('Server is running on port ',port);
})

