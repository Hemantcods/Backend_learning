import mongoose from 'mongoose'



const doctorSchema=new mongoose.Schema(
  {
    name:{
      type:String,
      required:true
    },
    salary:{
      type:Number,
      required:true
    },
    qualifications:{
      type:String,
      required:true
    },
    experienceInYears:{
      type:Number,
      default:0
    },
    worksInHospitals:[
      {
        type:mongoose.Schema.Types.ObjectId,
        ref:"Hostpital"
      }
    ]
  },{timestamps:true})

export const Doctor=mongoose.model("Doctor",doctorSchema)
