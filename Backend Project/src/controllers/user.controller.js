import asyncHandler from '../utils/asyncHandler.js'
import { ApiError } from '../utils/ApiError.js';
import { User } from '../models/user.model.js';
import { uploadOnCloudinary } from '../utils/cloudinary.js';
import { ApiResponse } from '../utils/ApiResponse.js';

const generateAccessAndRefreshToken=async(userID)=>{
    try {
        const user=await User.findOne({userID})
        const acess_token=user.generateAccessToken()
        const refresh_token=user.generateRefreshToken()
        user.refreshToken=refresh_token
        await user.save({ValidateBeforeSave:false})
        return {acess_token,refresh_token}
    } catch (error) {
        throw new ApiError(500,"something went wrong while genrating acess and refresh token")
    }
}

const registerUser=asyncHandler(async(req,res)=>{
    //  get user details from frontend
    const {email,username, password, fullName} = req.body;
    
    // validation-not empty
    if([fullName,email,username,password].some((field)=>field?.trim()==="")){
       throw new ApiError(400, "All fields are required", [], "Validation Error");
    }
    // check if user already exists(both username and password)
    await User.findOne({
        $or:[{email},{username}]
    })
    .then((user)=>{
        if(user){
            throw new ApiError(409, "User already exists", [], "User Exists");
        }
    })

    // check for avatar
    console.log("Checking for avatar and cover image in request files");
    console.log(req.files.avatar);
    
    const avatarLocalPath = req.files && req.files.avatar && req.files.avatar[0] ? req.files.avatar[0].path : undefined;
    const coverLocalPath = req.files && req.files.cover && req.files.cover[0] ? req.files.cover[0].path : undefined;

    if (!avatarLocalPath) {
        throw new ApiError(409, "avatar is required", [], "avatar is required");
    }
    // upload them to cloudinary
    const avatarResponse=await uploadOnCloudinary(avatarLocalPath);
    const coverResponse=coverLocalPath ? await uploadOnCloudinary(coverLocalPath) : null;
    // check uploaded or not
    if(!avatarResponse){
        throw new ApiError(500, "Error uploading avatar", [], "Avatar Upload Error");
    }
    // create user object
    const user=await User.create({
        fullName,
        email: email.toLowerCase(),
        username:username.toLowerCase(),
        password,
        avatar: avatarResponse.url,
        coverImage: coverResponse ? coverResponse.url : null,
    })
    const CreatedUser=await User.findById(user._id).select(
        "-password -refreshToken"
    )

    if(!CreatedUser){
        throw new ApiError(500, "Error creating user", [], "User Creation Error");
    }
    // save user to database
    // response to frontend without password and refresh field
    return res.status(201).json(
        new ApiResponse(201, CreatedUser, "User created successfully")
    );
})

const loginUser=asyncHandler(async(req,res)=>{
    // -> request body data
    const {email,username,password}=req.body
    
    // username or email
    if (!username || !email){
        throw new ApiError(400,"username or email required")
    }
    
    // find the user
    const user= User.findOne({
        $or:[{username},{email}]
    })
    if(!user){
        throw new ApiError(404,"username or password doesn't exists")
    }
    // password check
    const isPasswordValid=await user.isPasswordCorrect(password);
    if(!isPasswordValid){
        throw new ApiError(401,"password is incorrect")
    }
    // acess and refresh token 
    const {acess_token,refresh_token}=await generateAccessAndRefreshToken(user._id)
    // send secure cookies

          // AS PER THE EXPENSE OF CALLING THE DB              
    const loggedInUser=User.findById(user._id).select("-password -refreshToken")
    const options={
        httpOnly:true,
        secure:true
    }
    return res
    .status(200)
    .cookie('acessToken',acess_token,options)
    .cookie('refreshToken',refresh_token,options)
    .json(
        new ApiResponse(200,
            {
                user:loggedInUser,
                acess_token,
                refresh_token
            },
            "user logged in sucessfully"
        )
    )
})

const logoutUser=asyncHandler(async(req,res)=>{
    await User.findByIdAndUpdate(req.user._id,{
        $set:{
            refreshToken:undefined
              }
    },{
        new:true
    }
    )
    const options={
        httpOnly:true,
        secure:true
    }
    return res
    .status(200)
    .clearCookie("acessToken",options)
    .clearCookie("refreshToken",options)
    .json(
        new ApiResponse(200,{},"user logged out")
    )
})
export {registerUser,
    loginUser,
    logoutUser
}