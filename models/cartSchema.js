import mongoose from "mongoose";

const cartSchema = new mongoose.Schema({
    productID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true
    },
    userID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    selectedSize: {
        type: String,
        required: true
    },
    selectedColor: {
        type: String,
        required: true
    },
    quantity: {
        type: Number,
        required: true
    },
    price: {
        type: Number,
        required: true
    }
})

const Cart = mongoose.model("Cart", cartSchema)

export default Cart