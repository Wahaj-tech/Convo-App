import userModel from '../models/User.js'
import bcrypt from 'bcrypt'
import { generateToken } from '../../lib/utils.js';


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
            generateToken(newUser._id,res)//giving res so that we can store signup token in browser in terms of cookie
            await newUser.save();

            res.status(201).json({
                _id:newUser._id,
                fullName:newUser.fullName,
                email:newUser.email,
                password:newUser.password
            })
        }
        else{
            res.status(400).json({message:"Invalid user data"});
        }

}catch(err){
    console.log("error in signup controller:",err);
    res.status(500).json({message:"Internal Server error"})
    
}
}

export const logout=async(req,res)=>{
    res.send('logout endpoint')
}

export const login=async(req,res)=>{
    res.send('login endpoint')
}