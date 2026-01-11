//npm init -y
//npm i express mongoose jsonwebtoken socket.io bcrypt dotenv cookie-parser

// const express=require('express'); for performing import from type syntax put "type":"module" & under script "dev":"nodemon src/app.js" as app is under src folder similarly under script "start":"node src/app.js" as when we deploy it we don't want any changes

import express from 'express';
import dotenv from 'dotenv'//without this we'll get undefined for env varables

dotenv.config()//to perform process.env.Variable_name 
const app=express()

import authRoutes from './routes/auth.route.js'
import messageRoute from './routes/message.route.js'

app.use('/api/auth',authRoutes)
app.use('/api/message',messageRoute)


app.listen(process.env.PORT,()=>{
    console.log(`server is running on port ${process.env.PORT}`);
    
})  