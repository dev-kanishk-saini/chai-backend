import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';



    // Configuration
    cloudinary.config({ 
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
        api_key: process.env.CLOUDINARY_API_KEY , 
        api_secret: process.env.CLOUDINARY_API_SECRET // Click 'View API Keys' above to copy your API secret
    });


    const uploadOnCloudinary = async (localFilePath) => {
        try {
            
           if (!localFilePath) return null
           //upload the file on cloudinary 
           const response = await cloudinary.uploader.upload(localFilePath,{
            resource_type : "auto"
           })


        if (!response || !response.url) {
            console.log("Upload failed, no URL found:", response);
            return null;
        }
           //file has been uploaded successfully
           //console.log("file is uploaded on cloudianry", response.url);
           fs.unlinkSync(localFilePath)
           return response;
        
    } catch (error){

            // Log the error with more details for debugging
            console.error("Error uploading to Cloudinary:", error);
            console.error("Error details:", error.response || error.message); // More detailed error logs
    
       if (fs.existsSync(localFilePath))
        { fs.unlinkSync(localFilePath) //remove the locally saved temporary file as the upload operation got failed
        return null;
    }
 
    }
}

    export {uploadOnCloudinary}