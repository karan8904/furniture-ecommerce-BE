import User from "../models/userSchema.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

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

    const token = jwt.sign({ user }, process.env.JWT_KEY, {
      expiresIn: "7d",
    });

    res.status(200).json({ message: "Logged in Successful", token, user })

  } catch (error) {
    res.status(400).json({ message: `Login Failed:${error}` })
  }
};
