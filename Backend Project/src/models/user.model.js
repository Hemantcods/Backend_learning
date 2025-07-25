import mongoose,{Schema} from "mongoose";

const userSchema=new Schema({
    watchHistory:[
        {
            type:Schema.Types.ObjectId,
            ref:"Video"
        }
    ],
    username:{
        type:String,
        required:true,
        unique:true,
        lowercase:true,
        trim:true,
        index:true
    },
    email:{
        type:String,
        required:true,
        unique:true,
    },
    fullName:{
        type:String,
        required:true,
    },
    avatar:{
        type:String,
        default:""
    },
    coverImage:{
        type:String,
        default:""
    },
    password:{
        type:String,
        required:true,
    },

},{timestamps:true})

export const User=mongoose.model("User",userSchema)