import express from 'express'
const router=express.Router();

router.get('/signup',(req,res)=>{//equivalent to api/auth/signup
    res.send("Signup Endpoint");
})
router.get('/login',(req,res)=>{
    res.send('login endpoint')
})
router.get('/logout',(req,res)=>{
    res.send('logout endpoint')
})

export default router;