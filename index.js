const express = require("express");
const path = require("path");
const moment = require("moment");
const app = express();
const port = 4000;
const db = require("./Model/index");
require("./Config/dbConfig");
const ejs = require("ejs");
const userController = require("./Controller/userController");
const blogController = require("./Controller/blogController");
const commentController = require("./Controller/commentController");

const session = require('express-session')
const flash = require('connect-flash')

//for user
const {
  storage,
  multer,
  blogStorage
} = require('./Services/multerConfig'); // when you add new folder for image, pass its var from multerConfig here.
const upload = multer({
  storage: storage
});

//for blogs
const uploads = multer({
  storage: blogStorage
}); //to add in new folder,--> const name: ({storage: var name from multerConfig })

const dotenv = require('dotenv'); //JWT
const authController = require('./Middleware/isAuthenticated');
const catchAsync = require("./Services/catchAsync");
dotenv.config()

app.use(require("cookie-parser")());

app.set("view engine", "ejs");
app.use(express.json());
app.use(express.urlencoded({
  extended: true
}));
app.use(express.static(path.join(__dirname, 'Uploads/Users'))); //here you must provide the path of image so that image can be displayed directly from http://localhost ..... and alo ffrom FE
app.use(express.static(path.join(__dirname, 'Uploads/blogImage')));
// app.locals.moment = moment();
app.use(session({
  secret: 'mySession',
  cookie: {
    maxAge: 60000
  },
  resave: false,
  saveUninitialized: true
}));

app.use(flash()); //flash

db.sequelize.sync({
  force: false    //refresh database if true and clear it all
});

app.get("/", userController.index); //index page
app.get("/index", userController.index);


app.get("/createuser", userController.renderUser); // create user
app.post("/createuser", upload.single("image"), userController.createUser);

app.get("/login", userController.renderLogin); //login 
app.post("/login", userController.loginUser);
app.get("/logout", userController.logoutUser); //logout

app.post("/sendEmail", catchAsync(userController.emailNotification)); //send mass mail
app.get("/sendEmail", userController.renderEmail);

app.get("/forgotpassword", userController.forgotPassword); //forgot password and reset password
app.post("/verifyEmail", userController.verifyEmail);
app.get("/resetpassword", userController.renderResetPassword);
app.post("/resetpassword", userController.resetPassword);

app.get("/createblog",  authController.isAuthenticated, blogController.renderCreateBlog); // create blog
app.post("/createblog", authController.isAuthenticated, uploads.single("image"), blogController.createBlog)

app.get("/blog",authController.isAuthenticated, catchAsync(blogController.blog)); //display blogs
app.get("/myBlogs", authController.isAuthenticated, catchAsync(blogController.showMyBlogs));

app.get("/single/:id", authController.isAuthenticated, blogController.singleBlog); //single blog

app.get("/edit/:id", authController.isAuthenticated, blogController.editBlog); //edit blog
app.post("/updateblog/:id", authController.isAuthenticated, upload.single('image'), blogController.updateBlog);

app.get("/delete/:id", authController.isAuthenticated, blogController.deleteBlog); //delete blog

app.get("/eachblog/:blogId", authController.isAuthenticated, blogController.eachBlog); // for each blogs in index
app.post("/addComment/:blogId", authController.isAuthenticated, commentController.addComment); // add comments to blog

app.get("/editcomment/:blogId/:commentId", authController.isAuthenticated, commentController.editComment); //edit comments
app.post("/updatecomment/:blogId/:commentId", authController.isAuthenticated, commentController.updateComment);

app.get("/deletecomment/:blogId/:commentId", authController.isAuthenticated, commentController.deleteComment);//delete comments


app.listen(process.env.PORT, () => {
  console.log("Node server started at port 4000");
});