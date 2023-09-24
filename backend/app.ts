// @see https://github.com/motdotla/dotenv#how-do-i-use-dotenv-with-import
import * as dotenv from 'dotenv'
dotenv.config()

import express from 'express'
import user from './routes/user'
import s3 from './routes/s3'
import evaluation from './routes/evaluation'
import cors from 'cors'
import 'dotenv/config'

// express
const app = express()
const port = 3001
app.use(express.json())

// cors
// const allowedOrigins = [process.env.FRONTEND_LOCAL_ORIGIN as string, process.env.FRONTEND_PROD_ORIGIN as string]
app.use(
  cors()
)
app.options('*', cors())

// routes
app.use('/user', user)
app.use('/s3', s3)
app.use('/evaluation', evaluation)

app.listen(port)
