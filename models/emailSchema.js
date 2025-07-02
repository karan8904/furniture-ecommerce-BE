import mongoose from "mongoose";

const emailSchema = new mongoose.Schema({
    userID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: false
    },
    orderStatus: {
        type: Boolean,
        required: true
    },
    newProducts: {
        type: Boolean,
        required: true
    },
    offers: {
        type: Boolean,
        required: true
    },
    email: {
        type: String,
        required: true
    }
})

const EmailPreference = mongoose.model("EmailPref", emailSchema)

export default EmailPreference