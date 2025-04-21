const cloudinary = require('../config/cloudinary')

const uploadToCloud = async (filePath)=>{
   try 
   {
    const result = await cloudinary.uploader.upload(filePath)
    
    return {
        url : result.secure_url,
        publicId : result.public_id
    }
   } catch (error) {
    console.error("Error while uploading to cloudinary: ",error)
    throw new Error("Error while uploading to cloudinary");
   }
}

const deleteFromCloud = async (publicId) => 
{
    await cloudinary.uploader.destroy(publicId)
}

module.exports = {uploadToCloud,deleteFromCloud}