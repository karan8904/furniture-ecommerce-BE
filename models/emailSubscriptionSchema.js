import mongoose from "mongoose";

const emailSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true
    }
})

const EmailSubscription = mongoose.model("EmailSubscription", emailSchema)

export default EmailSubscription