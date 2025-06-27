import jwt from 'jsonwebtoken'
import User from '../models/userSchema.js';

export const adminAuth = async(req, res, next) => {
    let token;
    if(req.headers.authorization && req.headers.authorization.startsWith("Bearer")){
        try {
            token = req.headers.authorization.split(" ")[1]
            const decoded = jwt.verify(token, process.env.JWT_KEY)
            req.user = await User.findById(decoded.userID).select("-password")
            if(!req.user)
                return res.status(404).json({ message: "User not found." })
            if(!req.user.isAdmin)
                return res.status(401).json({ message: "Not Authorized." })
            next()
        } catch (error) {
            res.status(401).json({ message: "Not Authorized." })
        }
    }
    if(!token){
        res.status(401).json({ message: "No token found. Not Authorized." })
    }
}