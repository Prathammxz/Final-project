const db = require("../Model/index");
const User = db.user;
const bcrypt = require("bcryptjs");
const sendEmail = require("../Services/sendEmail");

exports.index = async (req, res) => {
  const users = await db.user.findAll();
  res.render("index", );
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

  res.render("login",{ error: null });
};

exports.loginUser = async (req, res) => {
  const { email, password } = req.body;
  const foundUser = await db.user.findOne({
    where: {
      email: email,
    },
  });

  if (!foundUser) {
    return res.render("login", { error: "Incorrect email" });
  }

  const passwordMatch = bcrypt.compareSync(password, foundUser.password);

  if (!passwordMatch) {
    return res.render("login", { error: "Incorrect password" });
  }

  res.redirect("/");
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
exports.forgotPassword = async (req, res) => {
  res.render("forgotpassword")
};

exports.verifyEmail = async (req, res) => {
  const email = req.body.email
  const isPresent = await User.findAll({
    where: {
      email: email,
    }
  });
  if(isPresent.length ==0){
    console.log("Email is not registered yet");
    res.redirect("/forgotpassword");
    return;  
  }
  else{
    console.log("Email is registered");
    try {
      const OTP = Math.floor(100000 + Math.random() * 900000);
      const message = "Your One Time Password is " + OTP + ".";

      await sendEmail({
        to: email,
        text: message,
        subject: "Reset Your Password",
      });

      isPresent[0].otp = OTP;
      await isPresent[0].save();
      res.render("resetPassword");
    } catch (e) {
      console.log("Error sending mail");
      console.log(e.message);
      res.render("error");
    }
  }
};

exports.renderResetPassword = (req, res) => {
  res.render("resetpassword");
};
exports.resetPassword = async (req, res) => {
  const { otp, newPassword } = req.body;
  const encPassword = bcrypt.hashSync(newPassword, 10);

  const verifyOTP = await User.findAll({
    where: {
      otp: otp,
    },
  });

  if (verifyOTP.length !== 0) {
    verifyOTP[0].password = encPassword;
    verifyOTP[0].otp = null;
    await verifyOTP[0].save();

    // Send email to the user
    const message = "Your password has been successfully changed.";
    try {
      await sendEmail({
        to: verifyOTP[0].email,
        text: message,
        subject: "Password Changed",
      });
      console.log("Email sent to the user after changing the password.");
    } catch (error) {
      console.log("Error sending email:", error);
    }
    res.redirect('/login');
  } else {
    console.log("Incorrect OTP");
    res.render("resetpassword", { error: "incorrect" });
  }
};
