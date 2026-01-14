import userModel from '../models/User.js'
import bcrypt from 'bcrypt'
import { generateToken } from '../lib/utils.js';
import { sendWelcomeEmail } from '../emails/emailHandler.js';

import dotenv from "dotenv"
dotenv.config()

// import dotenv from "dotenv"
// dotenv.config()  instead of this using in every file we can just import ENV from env.js in lib folder
import {ENV} from '../lib/env.js'
import cloudinary from '../lib/cloudinary.js';



export const signup=async(req,res)=>{
    try{
        let {fullName,email,password}=req.body;//we cannot have this without app.use(express.json()) in app.js file
        if(!fullName || !email || !password ){
            res.status(400).send("All feilds are required");
        }
        if(password.length<6){
            res.status(400).send("Password must be at least 6 characters")
        }
        //checking if email is valid or not through:regex(regular expression)
        const emailRegex=/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
        if(!emailRegex.test(email))
            return res.status(400).json({message:"Invalid Email Format"});
    
        //to check if user already existed-->
        const user=await userModel.findOne({email:email})
        if(user){
            return res.status(400).json({message:"user already existed"});
        }
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        const newUser=await userModel.create({
            fullName,
            email,
            password:hashedPassword,
        })
        if(newUser){
            
            const savedUser= await newUser.save();
            generateToken(savedUser._id,res)//giving res so that we can store signup token in browser in terms of cookie

            res.status(201).json({
                _id:newUser._id,  
                fullName:newUser.fullName,
                email:newUser.email,
                password:newUser.password
            })
            try{
                sendWelcomeEmail(savedUser.email,savedUser.fullName,process.env.CLIENT_URL)
            }catch(err){
                console.error("Failed to sent welcome email!:",error)
            }
        }
        else{
            res.status(400).json({message:"Invalid user data"});
        }

}catch(err){
    console.log("error in signup controller:",err);
    res.status(500).json({message:"Internal Server error"})
    
}
}


export const login=async(req,res)=>{

    try{
        const{email,password}=req.body;
        if(!email||!password){
            res.status(400).json({message:"all feilds are required "})
        }
        if(password.length<6){
                res.status(400).send("Password must be at least 6 characters")
        }
        const user=await userModel.findOne({email:email});
        if(!user){
            return res.status(400).json({message:"Invalid Credentials"});//never tell the client which one is incorrect (email or password)
        }
        const isPasswordCorrect=await bcrypt.compare(password,user.password);
        if(!isPasswordCorrect){
            return res.status(400).json({message:"Invalid Credentials"})
        }
        generateToken(user._id,res);
    
        res.status(201).json({
            _id:user._id,  
            fullName:user.fullName,
            email:user.email,
            password:user.password
        })
        try{
            sendWelcomeEmail(user.email,user.fullName,ENV.CLIENT_URL)
        }catch(err){
            console.error("Error Sending Welcome Email:",error);
        }
    }catch(err){
        console.error("error in login controller:",error);
        res.status(500).json({message:"Internal Server Error"})
        
    }

    
}

export const logout=(_, res)=>{//logout not need to be async function and req is not required
    res.cookie("jwt","",{maxAge:0});
    res.status(200).json({message:"Logged Out Successfully"});
}


export const updateProfile=async(req,res)=>{//this route will basiccally allow the user to update their profile Image and we would store the images in Cloudinary
    
    try{
        const{profilePic}=req.body;//taking profile pic from user
        if(!profilePic)
            return res.status(400).json({message:"profile pic is required"})
        const userId=req.user._id;//in req.user=we have all feild except password

        const uploadResponse= await cloudinary.uploader.upload(profilePic);//uploading the image to cloudinary but we also have to update the database-->
        const updatedUser=await userModel.findByIdAndUpdate(userId,{profilePic:uploadResponse.secure_url},{new:true});
        res.status(200).json({updatedUser});
    }catch(err){
        console.error("Error in update profile:",error);
        res.status(500).json({message:"internal server error"})
    }
}