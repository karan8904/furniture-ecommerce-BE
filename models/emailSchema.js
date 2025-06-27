import mongoose from "mongoose";

const emailSchema = new mongoose.Schema({
    userID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
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
})

const EmailPreference = mongoose.model("EmailPref", emailSchema)

export default EmailPreference