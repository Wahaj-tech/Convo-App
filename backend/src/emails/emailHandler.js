import { resendClient,sender } from "../lib/resend.js"
import { createWelcomeEmailTemplate } from "../emails/emailTemplate.js"

export const sendWelcomeEmail=async(email,name,clientURL)=>{
    const {data,error}=await resendClient.emails.send({
        from:`${sender.name} <${sender.email}>`,//eg. Wahaj Ahmad Khan <onboarding@resend.dev>
        to:email,
        subject:"Welcome to ConvoApp",
        html:createWelcomeEmailTemplate(name,clientURL),
    })
    if(error){
    console.error("Error sending welcome email:",error);
    return {success:false}
    }
    console.log("Welcome email sent successfully",data);

}//no need to learn this code ...go to resend website docs ->node js u will get the code


//Know some terms --->
/*1.TRANSACTIONAL STREAM: for triggering emails to one recipient at a time jaise login ya signup krne p welcome email jaata h ,password reset email ,confirmation email...etc

2.BULK STREAM: for promotional emails to multiple recipients at once
great for:product announcement ,newsletters ,terms and comnditions*/