import { asyncHandler } from "../utils/asynchandler.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { User } from "../models/user.model.js"
import  jwt  from "jsonwebtoken";
const generateAccessAndRefreshToken = async(userId)=>{
    try{
        const user = await User.findById(userId);
        const accessToken = user.generateAccessToken();
        const refreshToken = user.generateRefreshToken();
        
        await user.save({ validateBeforeSave: false})

        return {accessToken, refreshToken}
    }catch(error){
        throw new ApiError(500, "Something went wrong while generating refresh and access token")
    }
}

const registerUser = asyncHandler( async(req, res)=>{
    //get the data from the backend
    const {fullName, email, username, password } = req.body
    console.log("username: ", username);
    console.log("fullName: ", fullName);
    console.log("email: ", email);
    console.log("password: ", password);
    
    
    // validate the data
    if(
        [fullName, email, username, password].some((field) =>
        field?.trim() === "")
    ){
        throw new ApiError(400, "All fields are required")
    }
    console.log(req.body);
    //chack if user already exists
    const existedUser = await User.findOne({
        $or: [{ username }, { email }]
    })


    if(existedUser) {
        throw new ApiError(409, "User with email or username already exists")
    }
    //save the avatar and coverImage file path to the localserver
    // const coverImageLocalPath = req.files?.coverImage[0]?.path;
    

   
    // save the information to the database
    const user = await User.create({
        fullName,
       username,
        email, 
        password,
        
    })
    const {accessToken, refreshToken} = await generateAccessAndRefreshToken(user._id);
    
    //check if user is successfully uploaded and delete the password and refreshtoken
    const createdUser = await User.findById(user._id).select("-password -refreshToken")

    if(!createdUser){
        throw new ApiError(500, "Something went wrong while registering the user")
    }
    // successfully registered, return the response
    const options = {
        httpOnly: true, // Set to true for security in production
    maxAge: 1000 * 60 * 60 * 24,
        secure:true,
        sameSite: 'Strict'
    }
    return res.status(201)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
        new ApiResponse(200, 
            {
                user: createdUser, accessToken, refreshToken
            }
            , "User registered Successfully")
    )
})

const loginUser = asyncHandler(async(req, res)=>{
    const {email, password} = req.body;

    if(!(email)) {
        throw new ApiError (400, "email is required")
    }

    const user = await User.findOne({email}) 

    if(!user){
        throw new ApiError(404, "User does not exist")
    }
    const isPasswordValid = await user.isPasswordCorrect(password);

    if(!isPasswordValid){
        throw new ApiError (401, "Password not correct")
    } 

    const {accessToken, refreshToken} = await generateAccessAndRefreshToken(user._id);
    
    const loggedInUser = await User.findById(user._id).select("-password -refreshToken")
    const options = {
        httpOnly: true, // Set to true for security in production
    maxAge: 1000 * 60 * 60 * 24,
        secure:true,
        sameSite: 'Strict'
    }
    return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
        new ApiResponse(
            200,
            {
                user: loggedInUser, accessToken, refreshToken
            },
            "User logged in successfully"
        )
    )
})

const logoutUser = asyncHandler(async(req, res) => {
    await User.findByIdAndUpdate(
        req.user._id,
        {
            $unset: {
                refreshToken: 1
            }
        },
        {
            new: true
        }
    )

    const options = {
        httpOnly: true,
        secure: true,
        sameSite: 'Strict'
    }

    return res 
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "User logged Out"))
})

const refreshAccessToken = asyncHandler(async(req, res)=>{
    const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken

    if(!refreshAccessToken){
        throw new ApiError(401, "unauthorized request")
    }
        try{
            const decodedToken = jwt.verify(incomingRefreshToken,
                process.env.REFRESH_TOKEN_SECRET
            )

            const user = await User.findById(decodedToken?._id)

            if(!user){
                throw new ApiError(401, "Invalid refresh Token")
            }

            if(incomingRefreshToken != user?.refreshToken){
                throw new ApiError(401, "Refresh token is expired or used")
            }

            const options = {
                httpOnly: true,
                secure: true
            }

            const {accessToken, newRefreshToken} = await generateAccessAndRefreshToken(user._id)

            return res
            .status(200)
            .cookie("accessToken", accessToken, options)
            .cookie("refreshToken", newRefreshToken, options)
            .json(
                new ApiResponse(
                    200,
                    {accessToken, refreshToken: newRefreshToken},
                    "Access token refreshed"
                )
            )


        }catch(error){
                throw new ApiError(401, error?.message || "Invalid refersh Token " )
        }
    
})

const changeCurrentPassword = asyncHandler(async(req, res)=>{
    const {oldPassword, newPassword} = req.body;
    const user = await User.findById(req.user?._id)
    const isPasswordCorrect = await user.isPasswordCorrect(oldPassword)

    if(!isPasswordCorrect){
        throw new ApiError(400, "Wrong Password")
    }

    user.password = newPassword
    await user.save({validateBeforeSave: false})
    returnres
    .status(200)
    .json(new ApiResponse(200, {}, "Password changed successfully"))
})

const getCurrentUser = asyncHandler(async(req, res)=>{
    return res
    .status(200)
    .json(200, req.user, "current user fetched successfully")
})

const updateAccountDetails = asyncHandler(async(req, res)=>{
    const {fullName, email} = req.body;
    if(!fullName || !email) {
    throw new ApiError(400, "All fields are required")}

})



export {registerUser,
    loginUser,
    logoutUser,
    refreshAccessToken,
    changeCurrentPassword,
    getCurrentUser,
    updateAccountDetails
};