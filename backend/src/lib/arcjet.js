//rate limiting is a way to control how often someone can do something on a website or app like how many times they can refresh a page,make request to an API,or try to log in . 
//only 100 request per user every 2 minutes after that we'll break our server 
//Rate limiting helps with:1.preventing abuse(eg.stopping from making 1000 login attempts in a minute)...,  2.Protecting server from getting overwhelmed
//Status Code-->429 , stands for TOO MANY REQUEST
//Arcjet will be used to implement rate limitng,email validation ,attack protection,bot detection,etc
//login on arcject website,get the API key and goto node+express SDK then npm i @arcjet/node @arcjet/inspect and keys ARCJET_ENV and ARCJET_KEY
//copy the code
import { ENV } from "./env.js";
//import arcjet, { shield, detectBot, tokenBucket} from "@arcjet/node";
//we get tokenBucket which is also fine but we'll be using slidingWindow
import arcjet, { shield, detectBot, slidingWindow } from "@arcjet/node";


const aj = arcjet({
  key: ENV.ARCJET_KEY,
  rules: [
    // Shield protects your app from common attacks e.g. SQL injection
    shield({ mode: "LIVE" }),
    // Create a bot detection rule
    detectBot({
      mode: "LIVE", // Blocks requests. Use "DRY_RUN" to log only
      // Block all bots except the following
      allow: [
        "CATEGORY:SEARCH_ENGINE", // Google, Bing, etc
        // Uncomment to allow these other common bot categories
        // See the full list at https://arcjet.com/bot-list
        //"CATEGORY:MONITOR", // Uptime monitoring services
        //"CATEGORY:PREVIEW", // Link previews e.g. Slack, Discord
      ],
    }),
    // Create a token bucket rate limit. Other algorithms are supported.
    slidingWindow({
        mode:"LIVE",
        max:100,//100 request
        interval:60,//60 seconds
        //basically we are aloowing 100 request per minute
    })
  ],
});
//following code will be in middleware folder as it is a  protection layer like protected route so it will be added there
export default aj;


//is you will any arcjetProtected route like /api/auth/login (post method) then on postman aftegiving email and password in body then you will get "bot detected" in response as postman is technicallly a bot because it's an automated HTTP client,if you want to check slidingWindow is working rpoperly or not you can change mode to "DRY_RUN" in detectBot() method and for checking make max to 5 in slidingWindow then send request for 5 time ,at 6th time you will see too many request instead of normal response.