const express = require('express')
const authMiddleware = require('../Middleware/auth-middleware')
const adminMiddleware = require('../Middleware/admin-middleware')
const uploadMiddleware = require('../Middleware/upload-middleware')
const {uploadImage,fetchImages,deleteImage} =  require('../Controllers/image-controller')

const router = express.Router()

router.post('/upload',authMiddleware,adminMiddleware,uploadMiddleware.single('image'),uploadImage)
router.get('/get',authMiddleware,fetchImages)
router.delete('/:id',authMiddleware,adminMiddleware,deleteImage)

module.exports = router