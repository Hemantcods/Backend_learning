import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs'
import dotenv from 'dotenv';
dotenv.config({ path: './.env' });

// Configuration
cloudinary.config({ 
    cloud_name:process.env.CLOUDINARY_NAME, 
    api_key:process.env.CLOUDINARY_API_KEY, 
    api_secret:process.env.CLOUDINARY_API_SECRET,
});
    
const uploadOnCloudinary = async(localfilepath)=>{
    console.log("Uploading file to Cloudinary:", localfilepath);
    try {
        if(!localfilepath) return null;
        // upload
        const response=await cloudinary.uploader.upload(localfilepath,{
            resource_type:"auto"        
        })
        // file has been uploaded
        console.log("File has been uploaded to cloudinary",response.url);
        fs.unlinkSync(localfilepath) // delete local file after upload
        return response        
    } catch (error) { 
        fs.unlinkSync(localfilepath)
        console.error("Error uploading file to Cloudinary:", error);
        return null
    }
}

export {uploadOnCloudinary}