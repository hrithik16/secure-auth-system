const Users = require("../models/user");
const bcrypt = require("bcryptjs");
const saltRounds = process.env.SALT_ROUNDS;
const mailSender = require("../config/mailsender");

module.exports.home = function (req, res) {
  return res.render("home", { errMsg: "" });
};

module.exports.dashboard = function (req, res) {
  return res.render("dashboard");
};

module.exports.reset = function (req, res) {
  return res.render("reset");
};

module.exports.login = function (req, res) {
  return res.render("login", { errMsg: "" });
};

module.exports.signup = function (req, res) {
  return res.render("signup", {errMsg: ""});
};

module.exports.logout = function (req, res) {
  req.session.destroy();
  return res.render("home", { errMsg: "User Logged out" });
};

module.exports.signupPost = async function (req, res) {
  try {
    const isUserNameTaken = await Users.findOne({username:req.body.username})

    if(isUserNameTaken){
      return res.render("signup", {errMsg: "Username already taken :("})
    }

    const isEmailIdExist = await Users.findOne({emailId: req.body.emailId})

    if(isEmailIdExist){
      return res.render("signup", {errMsg: "User already Exist Try forgot password if you don't remeber the Password"})
    }

    const encryptedPassword = await hashPassword(req.body.password);
    const len = await Users.countDocuments({});
    const user = await Users.create({
      id: len + 1,
      username: req.body.username,
      emailId: req.body.emailId,
      password: encryptedPassword,
    });
    req.session.userId = user._id;
    return res.redirect("dashboard");
  } catch (error) {
    handleServerError(res, error, "Error adding user:");
  }
};

module.exports.loginPost = async function (req, res) {
  try {
    const user = await Users.findOne({ username: req.body.username });

    if (user) {
      const isPasswordValid = await isPasswordCorrect(req.body.password, user.password);

      if (isPasswordValid) {
        console.log("Login successful");
        req.session.userId = user._id;
        return res.redirect("dashboard");
      } else {
        handleLoginError(res, "Wrong Password");
      }
    } else {
      handleLoginError(res, "User not found");
    }
  } catch (error) {
    handleServerError(res, error, "Error during login:");
  }
};

module.exports.resetPost = async function (req, res) {
  const user = await Users.findById(req.session.userId);
  const isPasswordValid = await isPasswordCorrect(req.body.currentPassword, user.password);

  if (isPasswordValid) {
    try {
      const encryptedPassword = await hashPassword(req.body.newPassword);
      await Users.findByIdAndUpdate(req.session.userId, {
        password: encryptedPassword,
      });
      console.log("Password change successful");
      return res.redirect("dashboard");
    } catch (error) {
      handleServerError(res, error, "Error updating password:");
    }
  }

  req.session.destroy();
  return res.render("home", {
    errMsg: "Someone tried to reset the password with the wrong password",
  });
};

module.exports.forgotPassword = async function (req, res) {
  return res.render("forgotPassword", { errMsg: "" });
};

module.exports.forgotPasswordPost = async function (req, res) {
  const user = await Users.findOne({ emailId: req.body.emailId });

  if (user) {
    const newPassword = generatePassword();
    const isMailSent = await mailSender.sendMail(user.emailId, newPassword, user.username);

    if (isMailSent) {
      try {
        const encryptedPassword = await hashPassword(newPassword);
        await Users.findByIdAndUpdate(user._id, {
          password: encryptedPassword,
        });
        return res.redirect("login");
      } catch (error) {
        handleServerError(res, error, "Error updating password:");
      }
    }
  }

  else {
    return res.render("signup",{errMsg:"No user exist with the given mail please signup"});
  }

  return res.render("forgotPassword", { errMsg: "User not found" });
};

async function isPasswordCorrect(userPassword, dbPassword) {
  const isPasswordValid = await bcrypt.compare(userPassword, dbPassword);
  return isPasswordValid;
}

function generatePassword(length = 12) {
  const charset =
    "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_-+=<>?";
  let password = "";

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * charset.length);
    password += charset.charAt(randomIndex);
  }

  return password;
}

async function hashPassword(password) {
  try {
    const salt = await bcrypt.genSalt(saltRounds);
    return await bcrypt.hash(password, salt);
  } catch (error) {
    throw new Error(`Error hashing password: ${error.message}`);
  }
}

function handleLoginError(res, errMsg) {
  console.log(errMsg);
  return res.render("login", { errMsg });
}

function handleServerError(res, error, errMsg) {
  console.error(`${errMsg} ${error.message}`);
  // Handle or log the error in a more sophisticated way
  return res.status(500).send("Internal Server Error");
}
