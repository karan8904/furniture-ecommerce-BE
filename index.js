import express from 'express';
import { dbConnection } from './config.js'
import cors from 'cors'
import { userRoutes } from './routes/userRoutes.js';

const app = express()

app.use(express.json())
app.use(cors())

app.get('/', (req, res) => {
    res.send("App is running")
})

app.use('/users', userRoutes)

const startApp = async () => {
    try{
        await dbConnection()
        app.listen(5000, () => {
            console.log("App is connected with database and running on http://localhost:5000")
        })
    }
    catch{
        console.log("Cannot connect with database.")
    }
}

startApp()