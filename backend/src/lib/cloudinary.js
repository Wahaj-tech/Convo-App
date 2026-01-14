//can get this code directly from chatgpt or documentation of cloudinary

//npm i cloudinary
import{v2 as cloudinary} from 'cloudinary'
import { ENV } from './env.js'

cloudinary.config({//so that cloudinary know where are we uploading picture
    cloud_name:ENV.CLOUDINARY_CLOUD_NAME,
    api_key:ENV.CLOUDINARY_API_KEY,
    api_secret:ENV.CLOUDINARY_API_SECRET
})
export default cloudinary;


//goto cloudinary website login--->goto home (u will get cloudinary name) and goto setting-->api key -->from there u will get api_key and api secret
