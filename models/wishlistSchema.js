import mongoose from 'mongoose'

const wishlistSchema = new mongoose.Schema({
    userID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    productIDs: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true
    }]
})

const Wishlist = mongoose.model("Wishlist", wishlistSchema)
export default Wishlist