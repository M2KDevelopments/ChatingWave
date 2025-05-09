const path = require('path');
const multer = require('multer');

const storage = multer.diskStorage({
    destination: (req, file, callback) => callback(null, path.join(__dirname, '../uploads')),
    filename: (req, file, callback) => callback(null, file.originalname)
})
exports.upload = multer({ storage: storage });

