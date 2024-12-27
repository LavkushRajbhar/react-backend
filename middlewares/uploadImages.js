const multer = require('multer');
const sharp = require('sharp');
const path = require('path');


const mutlerStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, "../public/images"));
    },
    filename: function (req, file, cb) {

        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        cb(null, file.fieldname + "-" + uniqueSuffix + ".jpeg");
    }

})


const multerFilter = (req, file, cb) => {
    if (file.mimeType.startswith("image")) {

        cb(null, true);

    }
    else {
        cb({ message: "Unsupported or Invalid file format." }, false);

    }
}


const uploadPhoto = multer({
    storage: multerStorage,
    fileFilter: multerFilter,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
});

// Resize image middleware

const productImgResize = async (req, res, next) => {
    if (!req.files) return next();
    await Promise.all(
        
    )

}


module.exports = {uploadPhoto};