const multer = require("multer");
const path = require("path");

const uploadDir = path.join(__dirname, '../../public/');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

// Initialize multer with storage settings
const upload = multer({ storage: storage });

module.exports = upload;
