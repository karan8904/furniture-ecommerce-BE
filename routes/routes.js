import express from 'express'
import { userRoutes } from './userRoutes.js'
import { passwordRoutes } from './passwordResetRoutes.js'
import { categoryRoutes } from './categoryRoutes.js'
import { productRoutes } from './productRoutes.js'
import { contactRoutes } from './contactRoutes.js'
import { cartRoutes } from './cartRoutes.js'
import { addressRoutes } from './addressRoutes.js'
import { orderRoutes } from './orderRoutes.js'
import { emailRoutes } from './emailPreferenceRoutes.js'
import { paymentRoutes } from './paymentRoutes.js'
import { chargesRoutes } from './chargesRoutes.js'
import { wishlistRoutes } from './wishlistRoutes.js'
import { reviewRoutes } from './reviewRoutes.js'
import { subscriptionRoutes } from './subscriptionRoutes.js'
import { stripeRoutes } from './stripeRoutes.js'

export const routes = express.Router()

routes.get('/', (req, res) => {
    res.send("App is running")
})

routes.use('/users', userRoutes)
routes.use('/password', passwordRoutes)
routes.use('/categories', categoryRoutes)
routes.use('/products', productRoutes)
routes.use('/contacts', contactRoutes)
routes.use('/cart', cartRoutes)
routes.use('/address', addressRoutes)
routes.use('/orders', orderRoutes)
routes.use('/email', emailRoutes)
routes.use('/payment', paymentRoutes)
routes.use('/charges', chargesRoutes)
routes.use('/wishlist', wishlistRoutes)
routes.use('/reviews', reviewRoutes)
routes.use('/subscription', subscriptionRoutes)
routes.use('/stripe', stripeRoutes)