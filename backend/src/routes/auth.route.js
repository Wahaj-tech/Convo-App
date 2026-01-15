import express from 'express'
import { login, logout, signup , updateProfile } from '../controller/auth.controller.js';
import { protectRoute } from '../middleware/auth.middleware.js';
import { arcjetProtection } from '../middleware/arcjet.middleware.js';
const router=express.Router();

router.use(arcjetProtection)//instead of writing router.post('/signup',arcjetProtection,signup) in every route we can directly makeda middleware so if all good then it will go to the required route

router.post('/signup',signup)
router.post('/login',login)
router.post('/logout',logout)
//update profile route->(we sue PUT for updation)
router.put('/update-profile',protectRoute,updateProfile);

//to check user is authenticated or not-->
router.get("/check",protectRoute,(req,res)=>res.status(200).json(req.user))

// router.get('/testing',arcjetProtection,(req,res)=>{
//     res.status(200).json({message:"test route"})
// })  you can directly check my uncomment this and change the max to 5 in sliding window just for check & goto browser on thois route and refresh 5 time u wwill get too many request


export default router;