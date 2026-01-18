import axios from "axios";
export const axiosInstance=axios.create({
    baseURL:import.meta.env.MODE==="development"?"http://localhost:3000/api":"/api",//if we are in developmet then request will be send to localhost:3000 but if we are in production request will be send to    /api
    withCredentials:true,//this sends the cookies with request (helps in authentication)
})
//import.meta.env.MODE is a built-in Vite environment variable that indicates the current mode (development/production)
