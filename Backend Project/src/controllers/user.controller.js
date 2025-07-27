import asyncHandler from '../utils/asyncHandler.js'
import { ApiError } from '../utils/ApiError.js';
import { User } from '../models/user.model.js';
import { uploadOnCloudinary } from '../utils/cloudinary.js';
import { ApiResponse } from '../utils/ApiResponse.js';

const registerUser=asyncHandler(async(req,res)=>{
    //  get user details from frontend
    const {email,username, password, fullName} = req.body;
    
    // validation-not empty
    if([fullName.email,username,password].some((field)=>field?.trim()==="")){
       throw new ApiError(400, "All fields are required", [], "Validation Error");
    }
    // check if user already exists(both username and password)
    User.findOne({
        $or:[{email},{username}]
    })
    .then((user)=>{
        if(user){
            throw new ApiError(409, "User already exists", [], "User Exists");
        }
    })

    // check for avatar
    const avatarLocalPath=req.files?.avatar[0]?.path
    const coverLocalPath=req.files?.cover[0]?.path

    if(!avatarLocalPath){
        throw new ApiError(409,"avatar is required",[],"avatar is required");
    }
    // upload them to cloudinary
    const avatarResponse=await uploadOnCloudinary(avatarLocalPath);
    const coverResponse=coverLocalPath ? await uploadOnCloudinary(coverLocalPath) : null;
    // check uploaded or not
    if(!avatarResponse){
        throw new ApiError(500, "Error uploading avatar", [], "Avatar Upload Error");
    }
    // create user object
    const User=await User.create({
        fullName,
        email,
        username:username.toLowerCase(),
        password,
        avatar:avatarResponse.url,
        coverImage:coverResponse ? coverResponse.url : "",
    })
    const CreatedUser=await User.findById(User._id).select(
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

export {registerUser}