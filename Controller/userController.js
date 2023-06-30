const db = require("../Model/index");
const User = db.user;
const bcrypt = require("bcryptjs");
const sendEmail = require("../Services/sendEmail");

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

    const create = db.user.create({
        name: name,
        address: address,
        email: email,
        password: bcrypt.hashSync(password, 10),
        image: "http://localhost:4000/" + req.file.filename,
    });

    if (create) {
      try {
        const message = "You have successfully been registered to Pratham's app.";
  
        await sendEmail({
          to: req.body.email,
          text: message,
          subject: "Registration Successful",
        });
      } catch (e) {
        console.log("error sending mail");
        res.render("error");
      }
    }
    res.redirect("/login");
};

exports.renderLogin = async (req, res) => {

    res.render("login");
};

exports.loginUser = async (req, res) => {
    const { email,password} = req.body;
    const foundUser = await db.user.findAll({
      where: {
        email: email,
      }
    });
  
    if (foundUser.length == 0) { 
      return res.redirect("/login");
    }
    if (bcrypt.compareSync(password, foundUser[0].password)) {
      res.redirect("/");
    } else {
      res.redirect("/login");
    }
  
  };


exports.renderEmail = async (req, res) => {
    res.render("notification");
};
    
exports.emailNotification = async (req, res) => {
  try {
    const {
      subject,
      message
    } = req.body
    console.log(subject, message);

    // finding email from database
    const allUsers = await db.user.findAll({

    });
    allUsers.forEach(async (user) => {
      await sendEmail({
        to: user.email,
        text: message,
        subject: subject,
      })

    })

    res.redirect("/login");
  } catch {
    console.log("error sending mail")
    res.render("error")
  };
}; 

//forgot and reset password to continue

