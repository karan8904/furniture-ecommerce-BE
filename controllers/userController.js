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
    const token = jwt.sign({ userID: user._id }, process.env.JWT_KEY, {
      expiresIn: "7d",
    });
    res.status(201).json({ message: "User Registerd Successfully.", token, user });
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

    if(!user.isUserEnabled)
      return res.status(400).json({ message: "User cannot login." })

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

export const getAllUsers = async(req, res) => {
  try {
    const users = await User.find()
    res.status(200).json({ message: "Users fetched successfully.", users })
  } catch (error) {
    res.status(400).json({ message: "Cannot fetch users. Try again." })
  }
}

export const getUser = async(req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password")
    if(!user.isUserEnabled)
      return res.status(400).json({ message: "User cannot login." })
    res.status(200).json(user)
  } catch (error) {
    res.status(400).json({ message: "Invalid Token. Please login again." })
  }
}

export const editUser = async(req, res) => {
  try {
    const {firstName, lastName, phone, profilePicture} = req.body
    const newData = {
      firstName, 
      lastName, 
      phone, 
    }
    if(req.file)
      newData.profilePicture = req.file.path
    if(profilePicture)
      newData.profilePicture = profilePicture
    const user = await User.findByIdAndUpdate(req.user._id, newData, {new: true})
    res.status(200).json(user)
  } catch (error) {
    res.status(400).json({ message: "Cannot update user details." })
  }
}

export const changeUserStatus = async(req, res) => {
  try {
    const id = req.body.id
    const user = await User.findByIdAndUpdate(id, {isUserEnabled: req.body.status}, {new: true})
    res.status(200).json({ message: "User Status Updated Successfully.", user })
  } catch (error) {
    res.status(400).json({ messsage: "Cannot change user's status. Try again." })
  }
}

export const searchUsers = async(req, res) => {
  try {
    const query = req.params.query;
    const users = await User.find({ $or: [
      { firstName: { $regex: `^${query}`, $options: "i" } },
      { lastName: { $regex: `^${query}`, $options: "i" } },
      { "firstName+lastName": { $regex: `^${query}`, $options: "i" } },
    ] });
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: "User not found." });
  } 
}
