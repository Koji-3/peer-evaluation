const express = require('express')
const app = express()
const port = 3001
app.use(express.json());
require('dotenv').config()

// cors
const cors = require('cors');
const allowedOrigins = [process.env.FRONTEND_LOCAL_ORIGIN, 'https://peer-evaluation.vercel.app']
app.use(cors({
    origin: allowedOrigins,
    credentials: true, 
    optionsSuccessStatus: 200
}));

// TODO: 
// auth0 jwt config
// const { auth } = require('express-oauth2-jwt-bearer');
// const jwtCheck = auth({
//   // TODO: env
//   audience: 'https://peer-evaluation.com/api',
//   issuerBaseURL: 'https://peer-evaluation.jp.auth0.com/',
//   tokenSigningAlg: 'RS256'
// });
// app.use(jwtCheck);

// routes
const user = require('./routes/user');
app.use('/user', user);

app.listen(port)
