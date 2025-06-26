import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
    userID: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    products: [
        {
            productID: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Product",
            required: true
            }, 
            quantity: Number,
            selectedSize: String,
            selectedColor: String,
            price: Number
        }
    ],
    orderID: {
        type: String,
        required: true,
        unique: true
    },
    address: {
        type: Object,
        required: true
    },
    totalAmount: {
        type: Number,
        required: true
    },
    paymentMode: {
        type: String,
        required: true
    },
    paymentStatus: {
        type: String,
        required: true
    },
    paymentID: {
        type: String,
        required: false
    },
    orderStatus: {
        type: String,
        required: true
    },
},{
    timestamps: true
})

const Order = mongoose.model("Order", orderSchema)

export default Order