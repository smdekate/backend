import { v2 as cloudinary } from 'cloudinary';
import { error } from 'console';
import fs from "fs"

// Configuration
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

const uploadOnCloudinary = async (localFilePath) => {
    try {
        if(!localFilePath) return null

        // upload the file on cloudinary
        const response = await cloudinary.uploader.upload(localFilePath, { resource_type: 'auto' })

        // file has been uploaded successfully
        console.log(`file upload successful :: ${response.url}`);

        return response;
    } catch (error) {
        fs.unlinkSync(localFilePath) // remove locally saved temp file, if file upload falied
        console.log(`file upload failed :: ${error}`);
        return null;
    }
}

export { uploadOnCloudinary }