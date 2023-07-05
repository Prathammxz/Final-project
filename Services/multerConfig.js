const multer = require("multer");

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./Uploads/Users");           //destination where file is to be stored
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);     //how file is named while storing
  },
});

//to save images in new folder make another var with name you want and pass the destination and at last export the new var 
var blogStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./Uploads/blogImage");           
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);     
  },
});

module.exports = {
  multer,
  storage,
  blogStorage,
};