import jwt, { decode } from 'jsonwebtoken';
import userModel from '../models/User.js';
import {ENV} from '../lib/env.js';

export const socektAuthMiddleware=async(socket,next)=>{
    try{
        //extract token from http-only cookies
        const token=socket.handshake.headers.cookie
        ?.split("; ")
        .find((row)=>row.startsWith("jwt="))
        ?.split("=")[1];
        //Cookie: jwt=abc123; theme=dark
        //"jwt=abc123; theme=dark".split("; ")-->["jwt=abc123", "theme=dark"]
        //["jwt=abc123", "theme=dark"].find(...)=-->"jwt=abc123"
        //"jwt=abc123".split("=")-->["jwt", "abc123"]
        //Index [1] gives:"abc123"
        if(!token){
            console.log("Socket connection reject:no token provided");
            return next(new Error("Unauthorized - No token Provided"))
        }

        //now we have token->
        //verify the token-->
        const decoded=jwt.verify(token,ENV.JWT_SECRET);
        if(!decoded){
            console.log("Socket connection reject:Invalid Token");
            return next(new Error("Unauthorized - Invalid Token"));
        }
        //find user from db
        const user=await userModel.findById(decoded.userId).select("-password");
        if(!user){
            console.log("Socket connection rejected: User not found");
            return next(new Error("User not found"));
        }

        //attach user info to socket
        socket.user=user;//similar to req.user=user in authRoute.middleware.js
        socket.userId=user._id.toString();
        console.log(`Socket authenticated for user: ${user.fullName} (${user._id})`);
        
        next()//must after every middleware
    }
    catch(error){
        console.log("Error in socket authentication:",error.message);
        next(new Error("Unauthorized - Authentication Failed"))
    }
    
}