import { ENV } from "../lib/env.js";
import jwt from 'jsonwebtoken';
import userModel from '../models/User.js'

export const protectRoute=async(req,res,next)=>{
    try{
        const token=req.cookies.jwt
        if(!token){
            return res.send(401).json({message:"Unauthorized - No token Provided"})
            //res.redirect('/api/auth');
        }
        let decoded = jwt.verify(token,ENV.JWT_SECRET);
        if(!decoded)
            return res.status(401).json({message:"Unauthorized - Invalid Token"})
        const user=await userModel.findById(decoded.userId).select("-password")//we have given userId in token (can check generateToken () function inside util.js)
        if(!user)
            return res.status(404).json({message:"user not found"})
        req.user=user;//we are doing req.user so that we can send it to next method or middleware 
        next()
    }catch{
        console.error("Error in protected route Middleware:",error);
        res.status(500).json({message:"internal server error"})
    }
}