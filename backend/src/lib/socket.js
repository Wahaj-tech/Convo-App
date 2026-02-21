//npm i socket.io in backend 
//npm i socket.io-client in frontend

//socket io is a library that enables real-time, bidirectional and event-based communication between the browser and the server. It consists of two parts: a client-side library that runs in the browser, and a server-side library for Node.js. Both components have an identical API.
//socket.io removes the need for refreshing the page to update the content. It allows you to send and receive data in real-time, making it ideal for applications like chat apps, live notifications, and real-time analytics.

import {Server} from 'socket.io';
import http from 'http';//it's an inbuilt package in node
import express from 'express';
import {ENV} from './env.js';
import { socektAuthMiddleware } from '../middleware/socket.auth.middleware.js';
const app=express();//we have deleted the same line of code from app.js

const server=http.createServer(app);
const io=new Server(server,{
    cors:{
        origin:[ENV.CLIENT_URL],
        credentials:true,
    }
});

//apply authentication middleware for all socket connection
io.use(socektAuthMiddleware);

//for storing online users-->
const userSocketMap={};//{userId:socketId}

io.on("connection",(socket)=>{
    console.log("A User Connected:",socket.user.fullName);
    const userId=socket.userId;
    userSocketMap[userId]=socket.id;//{userId:socketId} 

    //io.emit() is used to send a message to all connected clients, including the sender. It broadcasts the message to everyone.
    io.emit("getOnlineUsers",Object.keys(userSocketMap));//Object.keys(userSocketMap) gives us an array of userIds who are online

    socket.on("disconnect",()=>{
        console.log("A User Disconnected:",socket.user.fullName);
        delete userSocketMap[userId];//remove the user from online users when they disconnect
        io.emit("getOnlineUsers",Object.keys(userSocketMap));//it send message to all clients that this is updated list of online users after disconnection of any user
    })
})

export {io,server,app};