const db = require("../Model/index");
const User = db.user;
const bcrypt = require("bcryptjs");

exports.index = async (req, res) => {
    const users = await db.user.findAll();
    res.render("index",);
};

exports.renderUser = async (req, res) => {
    res.render("createuser");
};

exports.createUser = async (req, res) => {
    const {
        name,
        address,
        email,
        password
    } = req.body

    db.user.create({
        name: name,
        address: address,
        email: email,
        password: bcrypt.hashSync(password, 10),
        image: "http://localhost:4000/" + req.file.filename,
    });

    res.redirect("/login");
};

exports.renderLogin = async (req, res) => {

    res.render("login");
};

exports.loginUser = async (req, res) => {
    console.log(req.body)
    const {
      email,
      password
    } = req.body;
    console.log(email, password);
  
  
    const foundUser = await db.user.findAll({
      where: {
        email: email,
      }
    });
  
    if (foundUser.length == 0) { //checking if email exists
      return res.redirect("/login");
    }
  
    console.log(foundUser[0].password);
    console.log(bcrypt.compareSync(password, foundUser[0].password));
  
    if (bcrypt.compareSync(password, foundUser[0].password)) {
      res.redirect("/home");
    } else {
      res.redirect("/login");
    }
  
  };