import EmailPreference from "../models/emailSchema.js";
import EmailSubscription from "../models/emailSubscriptionSchema.js";

export const setEmailPreference = async(req, res) => {
    try {
        const { orderStatus, offers, newProducts } = req.body
        const preference = await EmailPreference.findOne({ userID: req.user._id})
        if(preference){            
            await preference.updateOne({ orderStatus: orderStatus, offers: offers, newProducts: newProducts })
            await preference.save()
            return res.status(200).json({ message: "Preference Saved" })
        }
        const newPreference = await EmailPreference.insertOne({ userID: req.user._id, orderStatus: orderStatus, offers: offers, newProducts: newProducts })
        res.status(200).json({ message: "Peference saved.", newPreference })
    } catch (error) {
        res.status(400).json({ message: "Cannot save the preference.", error })
    }
}

export const getEmailPreference = async(req, res) => {
    try {
        const preference = await EmailPreference.findOne({ userID: req.user._id })
        if(!preference){
            return res.status(200).json({ orderStatus: false, offers: false, newProducts: false })
        }
        res.status(200).json(preference)
    } catch (error) {
        res.status(400).json({ message: "Cannot get the email preference. Try again." })
    }
}

export const setEmailSubscription = async(req, res) => {
    try {
        const email = req.body
        const isSub = await EmailSubscription.findOne(email)
        if(isSub)
            return res.status(400).json({ message: "You have already subscribed." })
        await EmailSubscription.insertOne(email)
        res.status(200).json({ message: "Thank you for subscribing." })
    } catch (error) {
        res.status(500).json({ message: "Cannot subscribe. Try again." })
    }
}