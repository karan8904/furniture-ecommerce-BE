import nodeCron from "node-cron";
import EmailPreference from "../models/emailSchema.js";
import sendMail from "./sendMail.js";
import EmailSubscription from "../models/emailSubscriptionSchema.js";

export const offerEmails = nodeCron.schedule("2 16 * * *", async() => {
    try {
        const offerPreferences = await EmailPreference.find({ offers: true }).populate("userID", "email")
        for(let i of offerPreferences){
            const user = i.userID
            const link = `${process.env.BASE_URL}/shop`
            const body = `<p>Checkout latest products and new offers in Furniro(only for limited time).</p>
                          <p><a href=${link}>Click Here<a> to check them out.</p>
                          <p>Do not miss it...</p>`
            await sendMail(user.email, "New Products and Offers in Furniro.", body)
        }
    } catch (error) {
        console.log("Error while sending mails.", error)
    }
})

export const subscriptionEmails = nodeCron.schedule("58 22 * * *", async() => {
    try {
        const emails = await EmailSubscription.find()
        for(let i of emails){
            const email = i.email
            const link = `${process.env.BASE_URL}/shop`
            const body = `<p>Checkout latest products and new offers in Furniro(only for limited time).</p>
                          <p><a href=${link}>Click Here<a> to check them out.</p>
                          <p>Do not miss it...</p>`
            console.log("mail sent to:",email)
            // await sendMail(user.email, "New Products and Offers in Furniro.", body)
        }
    } catch (error) {
        console.log("Error while sending mails.", error)
    }
})