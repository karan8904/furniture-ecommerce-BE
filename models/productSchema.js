import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    category:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category",
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    availableSizes: {
        type: Object,
        required: true
    },
    // images: {
    //     type:
    // }
})