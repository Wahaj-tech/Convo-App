import jwt from 'jsonwebtoken'

export const generateToken=(userId,res)=>{//taking res so that we can send it to browser in terms of cookies
    
    const {JWT_SECRET}=process.env
    if(!JWT_SECRET)
        throw new Error("JWT_SECRET is noy configured");

    const token = jwt.sign({userId},JWT_SECRET,{
        expiresIn:"7d",
    });
    res.cookie("jwt",token,{
        maxAge:7*24*60*60*1000,//7 days in miliSeconds
        httpOnly:true,//prevent XSS attacks:cross-site scripting
        secure:(process.env.NODE_ENV=="development")?false:true,
        sameSite:"strict"//CSRF attacks
    })
    return token;
}
//secure:(process.env.NODE_ENV=="development")?false:true,   (why?)
/*it states that if we are if development then make it false because in development we are at http( http://localhost) but in case of production make secure:true because at production we are at https(https://djdkvdk.com)*/