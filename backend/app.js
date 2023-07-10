const express = require('express')
const app = express()
const port = 3001
app.use(express.json());
require('dotenv').config()

// cors
const cors = require('cors');
const allowedOrigins = [process.env.FRONTEND_LOCAL_ORIGIN, process.env.FRONTEND_PROD_ORIGIN]
app.use(cors({
    origin: allowedOrigins,
    credentials: true, 
    optionsSuccessStatus: 200
}));

// routes
const user = require('./routes/user');
app.use('/user', user);
const s3 = require('./routes/s3');
app.use('/s3', s3);

app.listen(port)
