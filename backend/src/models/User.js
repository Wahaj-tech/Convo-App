import mongoose from "mongoose";

const userSchema=mongoose.Schema({
    fullName:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true,
    },
    password:{
        type:String,
        required:true,
        minlength:6,
    },
    profilePic:{
        type:String,
        default:""
    }
},{timeStamps:true})//to show user createdAt & updatedAt
const User=mongoose.model("User",userSchema);
export default User;