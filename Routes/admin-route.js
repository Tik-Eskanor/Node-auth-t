const express = require("express")
const router =  express.Router()
const authMiddleware = require("../Middleware/auth-middleware")
const adminMiddleware = require("../Middleware/admin-middleware")


router.get("/home", authMiddleware, adminMiddleware,(req,res)=>{
    const {userId,userName,role} = req.userInfo

    res.json({message:"Welcome to admin dashboard",
             user:{_id:userId,userName:userName,role:role}
    })
})

module.exports = router