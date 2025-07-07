import mongoose from "mongoose";

const chargesSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    chargePercent: {
        type: Number,
        required: true
    }
})

const Charges = mongoose.model("Charges", chargesSchema)

export default Charges