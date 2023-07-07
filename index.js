const express = require("express");
const path=require("path");
const app = express();
const port = 4000;
const db= require("./Model/index");
const ejs= require("ejs");
const userController = require ("./Controller/userController");
const blogController= require("./Controller/blogController");
//for user
const{storage,multer, blogStorage}=require('./Services/multerConfig');// when you add new folder for image, pass its var from multerConfig here.
const upload=multer({storage:storage});
//for blogs
const uploads=multer({storage:blogStorage});    //to add in new folder,--> const name: ({storage: var name from multerConfig })

const dotenv = require('dotenv'); //JWT
const authController=require('./Middleware/isAuthenticated');
dotenv.config()
app.use(require("cookie-parser")());
app.set("view engine","ejs");
require("./Config/dbConfig");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'Uploads/Users')));//here you must provide the path of image so that image can be displayed directly from http://localhost ..... and alo ffrom FE
app.use( express.static(path.join(__dirname, 'Uploads/blogImage')));


db.sequelize.sync({force:false});

app.get("/", userController.index); //index page
app.get("/index", userController.index);


app.get("/createuser", userController.renderUser);// create user
app.post("/createuser", upload.single("image"), userController.createUser);

app.get("/login", userController.renderLogin);//login 
app.post("/login", userController.loginUser);
app.get("/logout", userController.logoutUser)

app.post("/sendEmail", userController.emailNotification);//send mass mail
app.get("/sendEmail", userController.renderEmail);

app.get("/forgotpassword", userController.forgotPassword);//forgot password and reset password
app.post("/verifyEmail", userController.verifyEmail);
app.get("/resetpassword", userController.renderResetPassword);
app.post("/resetpassword", userController.resetPassword);

app.get("/createblog", blogController.renderCreateBlog);// create blog
app.post("/createblog", authController.isAuthenticated, uploads.single("image"), blogController.createBlog)

app.get("/blog", blogController.blog);//display blogs
app.get("/myBlogs", authController.isAuthenticated, blogController.showMyBlogs);


app.listen(process.env.PORT, () => {
    console.log("Node server started at port 4000");
  });