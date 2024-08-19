import { v2 as cloudinary} from "cloudinary";
import fs from "fs";
cloudinary.config({ 
    cloud_name: 'dvwxkhekb', 
    api_key: '159286513232273', 
    api_secret: 'cFEG9lutVdnOnbiDvvklYpy3MpA' // Click 'View Credentials' below to copy your API secret
});

const uploadOnCloudinary = async (localFilePath) =>{
    try{
        if(!localFilePath) return null
        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type:"auto"
        })
        fs.unlinkSync(localFilePath)
        return response;
        }
    catch(error){
        fs.unlinkSync(localFilePath)
        return null;
    }
}
 export { uploadOnCloudinary };