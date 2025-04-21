 const express = require("express")
 const {register,loginUser,changePassword} = require("../Controllers/auth-controller")
 const authMiddleware = require('../Middleware/auth-middleware')

 const router = express.Router()

 router.post('/register',register)
 router.post('/login',loginUser)
 router.post('/change-password', authMiddleware, changePassword)

 module.exports = router