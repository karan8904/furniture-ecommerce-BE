import User from "../models/userSchema.js";
import bcrypt from "bcryptjs";

export const registerUser = async (req, res) => {
    try {
        const { firstName, lastName, email, password, phone } = req.body
        const isUserExist = await User.findOne({email})
        if(isUserExist){
            return res.status(400).json({ message: "User with this email already exists." })
        }
        const hashedPassword = await bcrypt.hash(password, 10)
        const user = new User({ firstName, lastName, password: hashedPassword, email, phone })
        await user.save()
        res.status(201).json({ message: "User Registerd Successfully.", user })

    } catch (error) {
        console.log(error)
        res.status(500).json({ message: "Registration Failed..."})
    }
}

export const loginUser = async (req, res) => {
    
}