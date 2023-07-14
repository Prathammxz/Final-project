const db = require("../Model/index");
const User = db.user;
const bcrypt = require("bcryptjs");
const sendEmail = require("../Services/sendEmail");
const jwt = require("jsonwebtoken")


exports.index = async (req, res) => {
  const users = await db.user.findAll();
  res.render("index", {activePage: "index" });
};


exports.renderUser = async (req, res) => {
  res.render("createuser",{activePage: "createuser" });
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

  res.render("login", { success: req.flash("success"), activePage: "login"  });
};

exports.loginUser = async (req, res) => {
  const { email, password } = req.body;
  const foundUser = await db.user.findOne({
    where: {
      email: email,
    },
  });

  if (foundUser) {
    if (bcrypt.compareSync(password, foundUser.password)) {
      var token = jwt.sign({ id: foundUser.id }, process.env.SECRET_KEY, { expiresIn: 86400 });
      console.log(token);
      res.cookie('token', token);
      req.flash("success", ["Hello " + foundUser.name + ", You have successfully logged in!"]);
      res.redirect("/blog");
    } else {
      console.log("Login failed.");
      res.redirect("/login");
    }
  } else {
    console.log("User not found.");
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
  res.render("resetpassword", { error: null });
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


exports.logoutUser = async(req,res) =>{
    req.flash("success", "You have been logged out!");
    res.clearCookie("token")
    res.redirect("/login")
}

exports.userProfile = async (req, res) => {
  const user = await User.findOne({
    where: {
      id: req.params.id,
    },
  });
  
  res.render("userprofile", { user:req.user});
};


exports.editProfile = async(req,res) =>{
  const user = await User.findAll({
    where: {
      id: req.params.id,
    },
  });
  res.render("editprofile", { user:req.user , success: req.flash("success") });
}

exports.updateProfile = async(req,res) =>{
  let updateData = {
    name: req.body.name,
    address: req.body.address,
    email: req.body.email,
  };

  if (req.file) {
    const image = "http://localhost:4000/" + req.file.filename;
    updateData.image = image;
  }

  const user = await User.update(updateData, {
    where: {
      id: req.params.id
    },
  });

  req.flash("success", "User updated successfully!");
  res.redirect("/userprofile/"+req.params.id);
}


exports.deleteProfile = async (req, res) => {
  const user = await User.destroy({
    where: {
      id: req.params.id,
    },
  });

  req.flash("success", "Account deleted successfully!");
  res.redirect("/");
};




