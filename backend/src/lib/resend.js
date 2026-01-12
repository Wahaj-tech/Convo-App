import {Resend} from 'resend';
import { ENV } from '../lib/env.js';

// import dotenv from 'dotenv'
// dotenv.config()
//import "dotenv/config" we can also write this
export const resendClient=new Resend(ENV.RESEND_API_KEY);//THIS IS A RESEND CLIENT USED TO SEND EMAILS

export const sender={//SENDER INFORMATION
    email:ENV.EMAIL_FROM,
    name:ENV.EMAIL_FROM_NAME
};
