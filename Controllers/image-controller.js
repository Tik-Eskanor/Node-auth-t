const  connectToDb = require("../Database/db")
const {ObjectId} = require("mongodb");
const {UploadeToCloud,deleteFromCloud} = require('../helpers/cloudinary_helper')
const fs = require('fs')

// uploadToCloud

const uploadImage = async (req,res)=>
{
   try 
   {//   check if file is missing in req object
    if(!req.file)
    {
        return res.status(400)
        .json({success:false,messsage:"No file uploaded"})
    }

    // Upload image to cloud
    const {url,publicId} = await  UploadeToCloud(req.file.path)
    
    // Store image in database
    const data = {url,publicId,uploadedBy:req.userInfo.userId}
    const result = await connectToDb.collection('image').insertOne(data)
    if(result)
    {   
         //OPTIONAL -> remove the image from local storage folder (uploads)
         fs.unlinkSync(req.file.path)

        res.status(201).json({success:true,message:'Image uploaded',image:result})
    }
    else
    {
        res.status(400).json({success:false,message:'Unable to upload image'})
    }
   } catch (error) {
     console.error(error)
     res.status(500).json({
        success:false,
        messsage:"Something went wrong! Try again"
     })
   }
}

const fetchImages = async (req,res)=>
{
   try {

    const images = await connectToDb.collection('image').find().toArray()
    if(images)
    {
        res.status(200).json({success:true,data:images})
    }
   } catch (error) 
   {
     res.status(500).json({success:false,message:'Something went wrong:'})
   }
}

const deleteImage = async (req,res)=>
{
  try {
    const getCurrentIdOfImageToBeDeleted = req.params.id
    const userId = req.userInfo.userId

    const image = await connectToDb.collection('image').findOne({_id: ObjectId.createFromHexString(getCurrentIdOfImageToBeDeleted)})
    
    if(!image)
    {
      return res.status(404).json({success:false,message:'Image not found'})
    }

    // check if image is uploaded by current user trying to delete it
    if(image.uploadedBy.toString() !== userId)
    {
      return res.status(403).json({success:false,message:'You are not authorized to delete image'})
    }

    // delete from cloudinary
    await deleteFromCloud(image.publicId)

    const result = await connectToDb.collection('image').deleteOne({_id: ObjectId.createFromHexString(getCurrentIdOfImageToBeDeleted )})

    if(result)
    {
      res.status(200).json({success:true,message:"image deleted successfully"})
    }

  } catch (error) {
    console.log(error)
    res.status(500).json({success:false,message:'Something went wrong:'})
  }
}


module.exports = {uploadImage,fetchImages,deleteImage}