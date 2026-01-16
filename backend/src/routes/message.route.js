import express from 'express'
import { getAllContacts, getChatPartners, getMessagesByUserId, sendMessage } from '../controller/message.controller.js';
import { protectRoute } from '../middleware/auth.middleware.js';
import { arcjetProtection } from '../middleware/arcjet.middleware.js';
const router=express.Router()
router.use(arcjetProtection)//we want it to run in every route for protection of each route
//since protectRoute is used in each route we can also make a middleware for protectRoute but let it be ...later when i read it will be easier for me to understand the code
 
router.get('/contacts',protectRoute,getAllContacts);//it will show all user in contact(is user is logged in --->protectRoute is required)
router.get('/chats',protectRoute,getChatPartners);//it will show among all user in contact with whom you have talked
router.get('/:id',protectRoute,getMessagesByUserId)//it will show the particular userID messages

router.post('/send/:id',protectRoute,sendMessage);
export default router;