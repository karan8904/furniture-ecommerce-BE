import express from 'express'
import { userRoutes } from './userRoutes.js'
import { passwordRoutes } from './passwordResetRoutes.js'
import { categoryRoutes } from './categoryRoutes.js'
import { productRoutes } from './productRoutes.js'

export const routes = express.Router()

routes.get('/', (req, res) => {
    res.send("App is running")
})

routes.use('/users', userRoutes)
routes.use('/password', passwordRoutes)
routes.use('/categories', categoryRoutes)
routes.use('/products', productRoutes)