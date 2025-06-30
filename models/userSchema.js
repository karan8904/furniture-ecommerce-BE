import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    phone: {
        type: Number,
        required: true
    },
    isAdmin: {
        type: Boolean,
        default: false,
        required: true
    },
    isUserEnabled: {
        type: Boolean,
        default: true,
        required: true
    }
}, {
    timestamps: true
})

const User = mongoose.model('User', userSchema)
export default User