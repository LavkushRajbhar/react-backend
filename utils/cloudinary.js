const cloudinary = require("cloudinary")

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET,
});

const cloudinaryUploadImg = async (fileToUploads) => {
    return new Promise((resolve, reject) => {
        cloudinary.uploader.upload(
            fileToUploads,
            { resource_type: 'auto' }, // Ensure options are correctly placed
            (error, result) => {
                if (error) reject(error); // Reject on error
                else resolve({ url: result.secure_url }); // Resolve with secure URL
            }
        );
    });
};



module.exports= cloudinaryUploadImg