const cloudinary = require('cloudinary').v2

cloudinary.config({ 
    cloud_name: process.env.cloundinary_name,
    api_key: process.env.cloundinary_api,
    api_secret: process.env.cloundinary_secret // Click 'View API Keys' above to copy your API secret
});

module.exports = cloudinary