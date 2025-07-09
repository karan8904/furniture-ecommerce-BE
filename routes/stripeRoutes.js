import express from 'express'
import bodyParser from 'body-parser'
import { stripeWebhooks } from '../controllers/stripeController.js'

export const stripeRoutes = express.Router()

stripeRoutes.post('/webhook', bodyParser.raw({ type: "application/json" }), stripeWebhooks)