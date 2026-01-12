//npm init -y
//npm i express mongoose jsonwebtoken socket.io bcrypt dotenv cookie-parser
//npm i resend
//for welcome email for users-->Resend website is used (go to documentation for nodejs)

// const express=require('express'); for performing import from type syntax put "type":"module" & under script "dev":"nodemon src/app.js" as app is under src folder similarly under script "start":"node src/app.js" as when we deploy it we don't want any changes

//MONGO_URI=mongodb+srv://khanwahaj016_db_user:CYE9ptYpTcKOOAFX@cluster0.byhs2ac.mongodb.net/convoAppDB?appName=Cluster0 to name your data base putur name after .net/{ur DB name}? save any backend file

import express from 'express';
import dotenv from 'dotenv'//without this we'll get undefined for env varables
import path from 'path'


import authRoutes from './routes/auth.route.js'
import messageRoute from './routes/message.route.js'
import { connectDB } from '../src/lib/db.js';

dotenv.config()//to perform process.env.Variable_name 
const app=express()
const __dirname=path.resolve();
//#IMPORTANT#
app.use(express.json())//so that we'll get access to the feilds that user send from frontend.{req.body}

app.use('/api/auth',authRoutes)
app.use('/api/message',messageRoute)

//make ready for deployment-->
if(process.env.NODE_ENV=="production"){
    app.use(express.static(path.join(__dirname,"../frontend/dist")))

    app.get('{*slug}',(_,res)=>{
        res.sendFile(path.join(__dirname,"../frontend","dist","index.html"))//we can also write is as ../frontend/dist/index.html
    })
}
const PORT = process.env.PORT || 3000;
app.listen(process.env.PORT,()=>{
    console.log(`server is running on port ${process.env.PORT}`);
    connectDB()
})  
  