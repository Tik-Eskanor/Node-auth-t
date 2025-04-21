 require('dotenv').config()
 const express = require("express")

 const authRoutes = require("./Routes/auth-route")
 const userRoute = require("./Routes/user-route")
 const adminRoute = require("./Routes/admin-route")
 const imageRoute = require("./Routes/image-route")

 const app = express()
 const PORT = process.env.PORT || 3000

 
 app.listen(PORT,()=>{
    console.log("Database connected, Server is running")
 })

 // Middleware
 app.use(express.json())

 // Auth and authorization Routes
 app.use("/api/auth",authRoutes)
 app.use("/api/user-dashboard",userRoute)
 app.use("/api/admin-dashboard",adminRoute)
 
 app.use("/api/image",imageRoute)




