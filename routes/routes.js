import express from 'express'
import { userRoutes } from './userRoutes.js'
import { passwordRoutes } from './passwordResetRoutes.js'

export const routes = express.Router()

routes.get('/', (req, res) => {
    res.send("App is running")
})

routes.use('/users', userRoutes)
routes.use('/password', passwordRoutes)