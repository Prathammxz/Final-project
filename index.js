const express = require("express");
const path=require("path");
const app = express();
const port = 4000;
const db= require("./Model/index");
const ejs= require("ejs");
const userController = require ("./Controller/userController");
const blogController= require("./Controller/blogController");
//for user
const{storage,multer, blogStorage}=require('./Services/multerConfig');
const upload=multer({storage:storage});
//for blogs
const uploads=multer({storage:blogStorage});

const dotenv = require('dotenv'); //JWT
const authController=require('./Middleware/isAuthenticated');
dotenv.config()
app.set("view engine","ejs");


require("./Config/dbConfig");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname,'Uploads')));

db.sequelize.sync({force:false});

app.get("/", userController.index);
app.get("/index", userController.index);

// app.get("/loginhome", userController.loginHome);

app.get("/createuser", userController.renderUser);
app.post("/createuser", upload.single("image"), userController.createUser);

app.get("/login", userController.renderLogin);
app.post("/login", userController.loginUser);

app.post("/sendEmail", userController.emailNotification);
app.get("/sendEmail", userController.renderEmail);

app.get("/forgotpassword", userController.forgotPassword);
app.post("/verifyEmail", userController.verifyEmail);
app.get("/resetpassword", userController.renderResetPassword);
app.post("/resetpassword", userController.resetPassword);

app.get("/createblog", blogController.renderCreateBlog);
app.post("/createblog", uploads.single("image"), blogController.createBlog)
app.get("/blog", blogController.blog);


app.listen(process.env.PORT, () => {
    console.log("Node server started at port 4000");
  });