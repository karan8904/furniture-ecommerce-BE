import EmailPreference from "../models/emailSchema.js";

export const setEmailPreference = async(req, res) => {
    try {
        console.log(req.body)
        const { orderStatus, offers, newProducts } = req.body
        const preference = await EmailPreference.findOne({ userID: req.user._id})
        if(preference){            
            await preference.updateOne({ orderStatus: orderStatus, offers: offers, newProducts: newProducts})
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