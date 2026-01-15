//do check the arcjet file in lib folder
import aj from '../lib/arcjet.js';
import { isSpoofedBot } from "@arcjet/inspect";//spoofedBots are those which acts like a human instead they actually are bots


//we are writing all this code in middleware because it is a type of protection for routes like login signin etc
export const arcjetProtection=async(req,res,next)=>{
    //all these code are fromn website from where we get the npm and all
    try{
        const decision = await aj.protect(req);
        if (decision.isDenied()) {
            if (decision.reason.isRateLimit()) {
              res.writeHead(429, { "Content-Type": "application/json" });
              res.end(JSON.stringify({ error: "Too Many Requests" }));
            } else if (decision.reason.isBot()) {
              res.writeHead(403, { "Content-Type": "application/json" });
              res.end(JSON.stringify({ error: "No bots allowed" }));
            } else {
              res.writeHead(403, { "Content-Type": "application/json" });
              res.end(JSON.stringify({ error: "Forbidden" }));
            }
        }
        //checked for spoofed bot
        if (decision.results.some(isSpoofedBot)) {
            res.writeHead(403, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ error: "Forbidden" }));
        }
        //if this is not a spoofed bot and nothing denied(like too many rrequest and all) then we call normally call the next method
        next();
    }catch(err){

    }
}
    
    
//recap of arcjet--->get api key-->set env variables-->copy aj=arcjet code in arcjet.js file in lib folder--->make arcjetProtection method and paste decision code here(for rateLimiting(429 status code) and spoofedBot(403 forbidden code)) -->call next() method--->make a middleware in auth.route.js router.use(arcjetProtection)