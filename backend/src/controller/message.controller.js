import cloudinary from '../lib/cloudinary.js';
import messageModel from '../models/Message.js'
import userModel from '../models/User.js'



export const getAllContacts=async(req,res)=>{
    try{
        //in contact we want to see all the users but not ourselves ,for that we have to filter out ourselve...
        const loggedInUser=req.user._id;
        const filterUsers =await userModel.find({_id:{$ne:loggedInUser}}).select('-password')
        //we want to fetch every single user but not equal to that user which is loggedIn that's why we have to find() through _id:{$ne:userID}

        res.status(200).json({filterUsers})
    }catch(err){
        console.error("Error in getAllContacts:",err);
        res.status(500).json({message:"Server error"})
    }
}

export const getMessagesByUserId=async(req,res)=>{
    try{
        const myId=req.user._id;//loggedInuser
        const {id:userTochatId}=req.params;//among all the users when we click on any user ...uss user ka message milega toh yeh uss user ka Id hai
        const messages=await messageModel.find({
            $or:[//this is OR method used to get multiple data (either my messages or either another user messages)
                {senderId:myId,receiverId:userTochatId},//these are loggedInUser messages
                {senderId:userTochatId,receiverId:myId}//these are other user messages
            ]
        });
        res.status(200).json({messages})
    }catch(err){
        console.error("Error in getmessage controller:",err);
        res.status(500).json({error:"Internal Server Error"})        
    }
}

export const sendMessage=async(req,res)=>{
    try{
        const {text,image}=req.body;//what type of message is being sended
        const {id:receiverId}=req.params;
        const senderId=req.user._id;
        let imageURL;
        if(image){//if user provided the image
            const uploadResponse=await cloudinary.uploader.upload(image);
            imageURL=uploadResponse.secure_url;//it will give secure url of the image
        }
        const newMessage=await messageModel.create({
            senderId,
            receiverId,
            text,
            imageURL,
        });
        await newMessage.save();//save it to DB
        
        //todo: send message in real-time if user is online.(not just to save it on message db)

        res.status(200).json({newMessage})
    }catch(err){
        console.error("Error in sendMessage:",err);
        res.status(500).json({message:"Internal Server Error"})
    }
}

export const getChatPartners=async(req,res)=>{
    try{
        //here we'll show those persons with whom loggedInuser chated.
        const loggedInUser=req.user._id;
        //find all the messages where logged-in user is either sender or receiver-->
        const messages=await messageModel.find({
           $or:[{senderId:loggedInUser},{receiverId:loggedInUser}]
        });//woh saare message dedo jaha p loggedInUser sender h ya receiver h.
        //now we got messages(containing senderId,receiverId,text,image)
        //we want chatPartner ID not the whole message content...
        //if loggedinuser is sending message chatPartner will be the receiverId and if other person is sending then loggedInUser be the chatPartner
        const chatPartnerId=[...new Set(messages.map((msg)=>{//for every message of array of messages
            return (msg.senderId.toString()===loggedInUser.toString())?msg.receiverId.toString():msg.senderId.toString();
            //if loggedInuser is sender then chatPatner=msg.receiverId,if loggedInuser is not sender then chatPartner=msg.senderId(other person)
            //we cann't compare objectId(senderId) (loggedInUser) that's why toString()
            })
        )//making set to remove duplicates
        ]//look below for full explanation
    
        const chatPartner=await userModel.find({_id:{$in:chatPartnerId}}).select('-password');//$in:Give me all users whose _id exists inside this array
        res.status(200).json(chatPartner);
    }catch(err){
        console.error("Error in getChatPartner:",err);
        res.status(500).json({message:"Internal Server error"})
        
    }
}


/*messages is an array 
messages = [
  { senderId: "A", receiverId: "B" },//chatpartner will be B 
  { senderId: "A", receiverId: "C" },->chatpartner will be C
  { senderId: "B", receiverId: "A" }->chatpartner will be B
];
After map;["B", "C", "B"]-->chatPartners-->Array with duplicates but we don't ki kisi ek user k more than one chat option ho
new Set(["B", "C", "B"])...A Set stores only unique values.Automatically removes duplicates
Result:Set { "B", "C" }   But there’s a problem…,
Set is NOT an array-->
You can’t:
use .map()
use .filter()
send it easily in JSON
use it like a normal list

So we convert it back to an array.
[...set]  "..." ->Take every value inside the Set and put it into a new array
const set = new Set(["B", "C"]);
const arr = [...set];    otpt:// ["B", "C"]
*/