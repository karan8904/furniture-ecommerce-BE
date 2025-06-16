import mongoose, { Schema } from "mongoose";

const tokenSchema = new mongoose.Schema({
    userId: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: "user"
    },
    token: {
        type: String,
        required: true,
    },
    expireTime: {
        type: Date,
        required: true
    }
},
{
    timestamps: true
})

const Token = mongoose.model("token", tokenSchema)
export default Token