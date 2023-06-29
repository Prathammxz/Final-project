const express = require("express");
const path=require("path");
const app = express();
const port = 4000;
const db= require("./Model/index");
const ejs= require("ejs");
const userController = require ("./Controller/userController");
const{storage,multer}=require('./Services/multerConfig')
const upload=multer({storage:storage})
app.set("view engine","ejs");

require("./Config/dbConfig");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname,'Uploads')));

db.sequelize.sync({force:false});

app.get("/", userController.index);

app.get("/index", userController.index);

app.get("/createuser", userController.renderUser);

app.post("/createuser", upload.single("image"), userController.createUser);

app.get("/login", userController.renderLogin);

app.post("/login", userController.loginUser);



app.listen(port, () => {
    console.log("Node server started at port 4000");
  });