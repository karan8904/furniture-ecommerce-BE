import express from 'express';
import { dbConnection } from './config.js'
import cors from 'cors'
import { routes } from './routes/routes.js';
import { offerEmails, subscriptionEmails } from './utils/cronJobs.js';
import dotenv from 'dotenv';

const app = express()
dotenv.config()

app.use(express.json())
app.use(cors()) 
app.use('/uploads', express.static('uploads'))
app.use('/', routes)

const PORT = process.env.PORT || 5000
const startApp = async () => {
    try{
        await dbConnection()
        app.listen(PORT, () => {
            console.log(`App is connected with database and running on http://localhost:${PORT}`)
        })
    }
    catch(error){
        console.log("Cannot connect with database.")
    }
}

startApp()
// offerEmails.start()
// subscriptionEmails.start()