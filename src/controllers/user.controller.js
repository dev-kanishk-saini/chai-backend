import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";






const registerUser = asyncHandler( async (req,res) => {
    //get user details from frontend 
    //validation - not empty
    //check if  user already exist : username , email
    //check for images , check for avatar
    //upload them to cloudinary , avatar
    //create user object - create entry in db
    //remove password and refresh token field from response
    //check for user creation
    //return res
    

     const {fullname,username,email,password}= req.body
     //console.log("email",email);
    

     if ( 
        [fullname,email,username,password].some((field) => field?.trim() === "")
     ) {
        throw new ApiError(400,"all fields are required")
     }
     
     const existedUser = await User.findOne({
        $or : [{ username },{ email }]
     })
     
     if (existedUser) {
        throw new ApiError(409,"User with email or username already exists")
     }

     const avatarLocalPath = req.files?.avatar[0]?.path;
    // const coverImageLocalPath = req.files?.coverImage[0]?.path;
     
    const correctedAvatarLocalPath = avatarLocalPath.replace(/\\/g, '/');
    console.log("Corrected file path:", correctedAvatarLocalPath);
    

     if(!correctedAvatarLocalPath){
        console.log("Avatar file path is missing.");
        throw new ApiError(400, "Avatar file is required")
     }

    
     
      const avatar = await uploadOnCloudinary(correctedAvatarLocalPath);
      

      if(!avatar){
        console.log("Cloudinary upload failed for avatar:", avatarLocalPath);
        throw new ApiError(400,"Avatar file must required")
      }
      

      let coverImageLocalPath;
      //let correctedcoverImageLocalPath = null;
      if (req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length > 0){
         coverImageLocalPath = req.files.coverImage[0].path;}
 
        
           
 
      let coverImage;
      if(coverImageLocalPath){
           
         const correctedcoverImageLocalPath = coverImageLocalPath.replace(/\\/g, '/');
         console.log("Corrected file path:", correctedcoverImageLocalPath);
          coverImage =  await uploadOnCloudinary(correctedcoverImageLocalPath);
      }

      
     const user  = await User.create({
        fullname,
        avatar : avatar.url,
        coverImage : coverImage?.url || "",
        email,
        password,
        username : username.toLowerCase()
      })

       const createdUser = await User.findById(user._id).select("-password -refreshToken")

       if(!createdUser) { 
        throw new ApiError(500, "something went wrong while registering the user")
       }

        return res.status(201).json(
            new ApiResponse(200, createdUser , "User registered successfully")
        )


})


export {registerUser}