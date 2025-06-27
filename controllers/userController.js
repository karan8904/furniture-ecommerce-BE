import User from "../models/userSchema.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { jwtDecode } from "jwt-decode";

export const registerUser = async (req, res) => {
  try {
    const { firstName, lastName, email, password, phone } = req.body;
    const isUserExist = await User.findOne({ email });
    if (isUserExist) {
      return res
        .status(400)
        .json({ message: "User with this email already exists. Try another email..." });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({
      firstName,
      lastName,
      password: hashedPassword,
      email,
      phone,
    });
    await user.save();
    res.status(201).json({ message: "User Registerd Successfully.", user });
  } catch (error) {
    console.log(error); 
    res.status(500).json({ message: "Registration Failed..." });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({
        message: "User does not exist with given email. Please register...",
      });
    }

    const comparePasswords = await bcrypt.compare(password, user.password);

    if (!comparePasswords) {
      return res
        .status(400)
        .json({ message: "Incorrect Password. Try again..." });
    }

    const token = jwt.sign({ userID: user._id }, process.env.JWT_KEY, {
      expiresIn: "7d",
    });

    res.status(200).json({ message: "Logged in Successful", token, user })

  } catch (error) {
    res.status(400).json({ message: `Login Failed:${error}` })
  }
};

export const getUser = async(req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password")
    res.status(200).json(user)
  } catch (error) {
    res.status(400).json({ message: "Invalid Token. Please login again." })
  }
}

export const editUser = async(req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.user._id, req.body, {new: true})
    res.status(200).json(user)
  } catch (error) {
    res.status(400).json({ message: "Cannot update user details." })
  }
}
