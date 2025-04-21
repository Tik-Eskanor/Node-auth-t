const connectToDb = require("../Database/db")
const {ObjectId} = require("mongodb");
const bcrypt = require('bcryptjs')
const jwt = require("jsonwebtoken")

const register = async (req,res)=> 
{
   try {
    //  extract user information from req bod
    const {userName,email,password,role} = req.body

    // Check if user already exists
    const userExists = await connectToDb.collection('user').findOne({$or: [{userName},{email}]})
    if(userExists)
    {
      return res.status(400).json({
         success:false,
         message:'username or email already exists'
       })
    }

    // hash user password
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password,salt)

    // create new user
    const data = {userName:userName,email:email,password:hashedPassword,role:role || 'user'}

    const result = await connectToDb.collection('user').insertOne(data)
    if(result)
    {
        res.status(201).json({success:true,message:'User created successfully'})
    }
    else
    {
        res.status(400).json({success:false,message:'Unable to register user'})
    }

   }catch(e) 
   {
     console.log(e)
     res.status(500).json({
        success:false,
        message:'Something went wrong. Try again.'
     })
   }
}

const loginUser = async (req,res)=>
    {
       try{
           const {userName,password} = req.body;
           const user = await connectToDb.collection('user').findOne({userName})
           console.log(user)

         if(!user)
         {
            return res.status(400).json({success:false,message:"Invalid username"})
         }

         const passwordMatch = await bcrypt.compare(password,user.password)
         if(!passwordMatch)
         {
            return res.status(400).json({success:false,message:"Invalid password"})
         }

         // Create user token
         const tokenData = {userId:user._id,userName:user.userName,role:user.role}
         const accessToken = jwt.sign(tokenData,process.env.JWT_SECRET_KEY,{expiresIn:'15m'})
         
         res.status(200).json({
            success:true,
            message:"user loggined successfully",
            accessToken
         })
        
       }catch(e) 
       {
         console.log(e)
         res.status(500).json({
            success:false,
            message:'Something went wrong. Try again.'
         })
       }
    }

    const changePassword = async (req,res) => 
    {
      try {
         const userId = req.userInfo.userId

         // extract old and new password
         const {oldPassword,newPassword} = req.body

         const user = await connectToDb.collection('user').findOne({_id: ObjectId.createFromHexString(userId)})

         if(!user)
         {
            return res.status(400).json({
               success:false,
               message:'User not found'
            })
         }
         
         // check if old password is correct
         const isPasswordMatch = await bcrypt.compare(oldPassword,user.password)
         if(!isPasswordMatch)
         {
            return res.status(400).json({
               success:false,
               message:'Invalid old password'
            })
         }

         // hash new password
         const salt = await bcrypt.genSalt(10)
         const newHashedPassword = await bcrypt.hash(newPassword,salt)

         // update user password
         const result = await connectToDb.collection('user').updateOne({_id:ObjectId.createFromHexString(userId)},{$set:{password:newHashedPassword}})
         if(result)
         {
            res.status(200).json({success:true,message:'Password updated successfully'})
         }


      } catch (error) {
         console.log(error)
         res.status(500).json({
            success:false,
            message:'Something went wrong. Try again.'
         })
      }
    }

    module.exports = {register,loginUser,changePassword}