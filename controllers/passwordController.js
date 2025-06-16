import User from "../models/userSchema.js";
import Token from "../models/tokenSchema.js";
import sendMail from "../utils/sendMail.js";
import bcrypt from "bcryptjs";
import crypto from "crypto";

export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user)
      return res
        .status(404)
        .json({ message: "User not found with this email." });

    let token = await Token.findOne({ userId: user._id });

    if (!token) {
      token = await new Token({
        userId: user._id,
        token: crypto.randomBytes(32).toString("hex"),
        expireTime: Date.now() + 15 * 60 * 1000
      }).save();
    }
    const link = `${process.env.BASE_URL}/password-reset/${user._id}/${token.token}`;

    const body = `<p>You requested a password reset</p>
                <p><a href="${link}">Click here</a> to reset your password. This link expires in 15 minutes.</p>`;

    await sendMail(user.email, "Password Reset", body);

    res
      .status(200)
      .json({ message: "Password reseting link is sent to your account." });
  } catch (error) {
    res
      .status(400)
      .json({ message: "Unexpected error occured. Please try again." });
  }
};

export const resetPassword = async (req, res) => {
  try {
    const { userId, token, newPassword } = req.body;
    const user = await User.findById(userId);
    if (!user)
      return res
        .status(404)
        .json({ message: "Invalid link.." });
    
    const isTokenValid = await Token.findOne({
        userId: user._id,
        token: token,
    })

    if(!isTokenValid || isTokenValid.expireTime < Date.now())
        return res
        .status(404)
        .json({ message: "Invalid link.." });

    const newHashedPassword = await bcrypt.hash(newPassword, 10)
    user.password = newHashedPassword
    await user.save()
    await isTokenValid.deleteOne()
    res.status(200).json({message: "Password has been updated successfully. Login with new password"})
  } catch (error) {
    res
      .status(400)
      .json({ message: "Unexpected error occured. Please try again." });
  }
};
