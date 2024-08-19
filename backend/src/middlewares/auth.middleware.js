import { ApiError } from "../utils/apiError.js";
import { asyncHandler } from "../utils/asynchandler.js";
import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";
export const requireAuth = asyncHandler(async(req, _, next) => {
    try
    {
        const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "")

    
    if(!token){
        throw new ApiError(401, "Unauthorized request")
    }

    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)

    const user = await User.findById(decodedToken?._id).select("-password -refreshToken")
    if(!user){
        //frontend discuss
        throw new ApiError(401, "Invalid Access Token")
    }

    req.user = user;
    next()
}catch (error) {
    throw new ApiError(401, error?.message || "Invalid access token")
}
})

// import jwt from 'jsonwebtoken';

// const requireAuth = async (req, res, next) => {
//   const { authorization } = req.cookies.accessToken;
//   if (!authorization) {
//     console.log('Authorization header is missing');

//     return res.status(401).json({ message: 'Unauthorized' });
//   }
//   const token = authorization.split(' ')[1] + "";

//   try {
//     const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
//     req.user = decoded;
//     req.token = token;
//     next();
//   } catch (error) {
//     if (error.name === 'TokenExpiredError') {
//       return res.status(401).json({ message: 'Token has expired' });
//     } else if (error.name === 'JsonWebTokenError') {
//       return res.status(401).json({ message: 'Invalid token' });
//     } else {
//       console.error('JWT error:', error);
//       return res.status(500).json({ message: 'Internal Server Error' });
//     }
//   }
// }
export default requireAuth;