import express from 'express'
import { getEmailPreference, setEmailPreference, setEmailSubscription } from "../controllers/emailController.js";
import { userAuth } from '../middlewares/userAuthMiddleware.js';

export const emailRoutes = express.Router()

emailRoutes.post("/setPreference", userAuth, setEmailPreference)
emailRoutes.get("/getPreference", userAuth, getEmailPreference)
emailRoutes.post("/setSubscription", setEmailSubscription)
