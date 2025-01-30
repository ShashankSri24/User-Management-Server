import express from 'express'
import { config } from 'dotenv';
import cors from 'cors'
import  { DatabaseConnect } from './database/db.js';
import userRoutes from './routes/userRouter.js'

const app = express()

config();
app.use(cors()) 
app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use('/public/upload', express.static('public/upload'));
const PORT = 4000 || process.env.PORT;

app.use('/api',userRoutes)
DatabaseConnect()

app.listen(PORT,()=> 
   console.log( `Server is running on PORT number :  ${PORT}`))