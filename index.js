import express from 'express';
import { dbConnection } from './config.js'
import cors from 'cors'
import { routes } from './routes/routes.js';

const app = express()

app.use(express.json())
app.use(cors())
app.use('/', routes)


const startApp = async () => {
    try{
        await dbConnection()
        app.listen(5000, () => {
            console.log("App is connected with database and running on http://localhost:5000")
        })
    }
    catch(error){
        console.log("Cannot connect with database.")
    }
}

startApp()