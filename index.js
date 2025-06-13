import express from 'express';
import { dbConnection } from './config.js'

const app = express()

app.get('/', (req, res) => {
    res.send("App is running")
})

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