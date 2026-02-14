//npm init -y
//npm i express mongoose jsonwebtoken socket.io bcrypt dotenv cookie-parser
//npm i resend
//for welcome email for users-->Resend website is used (go to documentation for nodejs)

// const express=require('express'); for performing import from type syntax put "type":"module" & under script "dev":"nodemon src/app.js" as app is under src folder similarly under script "start":"node src/app.js" as when we deploy it we don't want any changes

//MONGO_URI=mongodb+srv://khanwahaj016_db_user:CYE9ptYpTcKOOAFX@cluster0.byhs2ac.mongodb.net/convoAppDB?appName=Cluster0 to name your data base putur name after .net/{ur DB name}? save any backend file

import express from 'express';
import dotenv from 'dotenv'//without this we'll get undefined for env varables
import path from 'path'
import cookieParser from 'cookie-parser'
import cors from 'cors'


import authRoutes from './routes/auth.route.js'
import messageRoute from './routes/message.route.js'
import { connectDB } from '../src/lib/db.js';

dotenv.config()//to perform process.env.Variable_name 
const app=express()
const __dirname=path.resolve();
//#IMPORTANT#  payload to large error
app.use(express.json())//so that we'll get access to the feilds that user send from frontend.{req.body}.....it express.json() will not allow to send more than 500KB so that we will increase the limit\
app.use(cors({
    origin:process.env.CLIENT_URL,
    credentials:true,//this says that allow frontend to send cookies to our backend so that we can use axios or fetch method
}));
app.use(cookieParser())


app.use('/api/auth',authRoutes)
app.use('/api/messages',messageRoute)

//make ready for deployment-->
if(process.env.NODE_ENV=="production"){
    app.use(express.static(path.join(__dirname,"../frontend/dist")))

    app.get(/.*/,(_,res)=>{
        res.sendFile(path.join(__dirname,"../frontend","dist","index.html"))//we can also write is as ../frontend/dist/index.html
    })
}
const PORT = process.env.PORT || 3000;
app.listen(PORT,()=>{
    console.log(`server is running on port ${process.env.PORT}`);
    connectDB()
})  
  

