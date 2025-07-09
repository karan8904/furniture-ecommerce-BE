import mongoose from "mongoose";

const subscriptionSchema = new mongoose.Schema({
    userID: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "User"
    },
    customerID: {
        type: String,
        required: true
    },
    subscriptionID: {
        type: String,
    },
    priceID: {
        type: String
    },
    status: {
        type: String,
        enum: ["active", "canceled", "ended"],
    },
    startDate: {
        type: Date,
    },
    endDate: {
        type: Date,
    },
    invoiceUrl: {
        type: String
    },
    cancelAtPeriodEnd: {
        type: Boolean,
        default: false
    }
})

const Subscription = mongoose.model("Subscription", subscriptionSchema)

export default Subscription