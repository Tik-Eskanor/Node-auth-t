const multer = require('multer')
const path = require('path')

const storage = multer.diskStorage({
    destination: function(req,file,cb){
        cb(null,'uploads/')
    },
    filename: function(req,file,cb)
    {
        cb(null,file.fieldname + '-' + Date.now() + path.extname(file.originalname))
    }
})

// Check file filter
 const checkFilefFilter = function(req,file,cb)
 {
     if(file.mimetype.startsWith('image'))
     {
        cb(null,true)
     }
     else
     {
        cb(new Error('not an image. upload an image'))
     }
 }

//  Multer middleware
module.exports = multer({
    storage:storage,
    fileFilter:checkFilefFilter,
    limits:{
        fileSize: 5 *1024*1024 // file size 5mb
    }
})