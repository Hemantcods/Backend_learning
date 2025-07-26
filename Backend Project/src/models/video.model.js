import mongoose,{Schema} from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";


const videoSchema = new Schema({
    id:{
        type:Schema.Types.ObjectId,
        ref:"User"
    },owner:{
        type:Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    videoFile:{
        type:String, //cloudinary url
        required:true, 
    },
    thrumbnail:{
        type:String, //cloudinary url
        required:true,
    },
    title:{
        type:String,
        required:true,
    },
    description:{
        type:String,
        required:true,
    },
    duration:{
        type:Number, //cludinary duration in seconds
        required:true,
    },
    views:{
        type:Number,
        default:0,
    },
    isPublished:{
        type:Boolean,
        default:false,
    },

},{timestamps:true})

videoSchema.plugin(mongooseAggregatePaginate);

export const Video=mongoose.model("Video",videoSchema)