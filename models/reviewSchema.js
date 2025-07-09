import mongoose from 'mongoose'

const reviewSchema = new mongoose.Schema({
    userID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    productID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true
    },
    description: {
        type: String,
        required: true
    },
    ratingScore: {
        type: Number,
        required: true
    }
}, {
    timestamps: true
})

const Review = mongoose.model("Review", reviewSchema)

export default Review