import nodeCron from "node-cron";
import EmailPreference from "../models/emailSchema.js";
import sendMail from "./sendMail.js";

const offerEmails = nodeCron.schedule("0 10 * * *", async() => {
    try {
        const offerPreferences = await EmailPreference.find({ offers: true }).populate("userID", "email")
        for(let i in offerPreferences){
            const user = i.userID
            // await sendMail(user.email, "New Offers", )
        }
    } catch (error) {
        console.log("Error while sending mails.", error)
    }
})
