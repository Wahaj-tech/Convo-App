import express from 'express'
import { login, logout, signup , updateProfile } from '../controller/auth.controller.js';
import { protectRoute } from '../middleware/auth.middleware.js';
const router=express.Router();

router.post('/signup',signup)

router.post('/login',login)
router.post('/logout',logout)
//update profile route->(we sue PUT for updation)
router.put('/update-profile',protectRoute,updateProfile);


//to check user is authenticated or not-->
router.get("/check",protectRoute,(req,res)=>res.status(200).json(req.user))
export default router;