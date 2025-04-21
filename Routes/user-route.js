const express = require("express")
const router =  express.Router()
const authMiddleware = require("../Middleware/auth-middleware")


router.get("/home", authMiddleware, (req,res)=>{
    const {userId,userName,role} = req.userInfo
    res.json({message:"Welcome to user dashboard",
             user:{_id:userId,userName:userName,role:role}
    })
})

module.exports = router