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
  return res.render("signup");
};

module.exports.logout = function (req, res) {
  req.session.destroy();
  return res.render("home", { errMsg: "User Logged out" });
};

module.exports.signupPost = async function (req, res) {
  const encryptedPassword = await bcrypt
    .genSalt(saltRounds)
    .then((salt) => {
      return bcrypt.hash(req.body.password, salt);
    })
    .catch((err) => console.error(err.message));

  const len = await Users.countDocuments({});
  try {
    const user = await Users.create({
      id: len + 1,
      username: req.body.username,
      emailId: req.body.emailId,
      password: encryptedPassword,
    });
    req.session.userId = user._id;
    return res.redirect("dashboard");
  } catch (error) {
    console.error("Error adding user:", error);
  }
};

module.exports.loginPost = async function (req, res) {
  try {
    const user = await Users.findOne({ username: req.body.username });

    if (user) {
      const isPasswordValid = await isPasswordCorrect(
        req.body.password,
        user.password
      );

      if (isPasswordValid) {
        // Password is correct, proceed with login logic
        console.log("Login successful");
        req.session.userId = user._id;
        return res.redirect("dashboard");
      } else {
        console.log("Invalid password");
        return res.render("login", { errMsg: "Wrong Password" });
      }
    } else {
      console.log("User not found");
      return res.render("login", { errMsg: "User not found" });
    }
  } catch (error) {
    console.error("Error during login:", error);
  }
};

module.exports.resetPost = async function (req, res) {
  const user = await Users.findById(req.session.userId);
  const isPasswordValid = await isPasswordCorrect(
    req.body.currentPassword,
    user.password
  );
  if (isPasswordValid) {
    const encryptedPassword = await bcrypt
      .genSalt(saltRounds)
      .then((salt) => {
        return bcrypt.hash(req.body.newPassword, salt);
      })
      .catch((err) => console.error(err.message));
    try {
      await Users.findByIdAndUpdate(req.session.userId, {
        password: encryptedPassword,
      });
      console.log("password change sucess");
      return res.redirect("dashboard");
    } catch (error) {
      console.error("Error updating password:", error);
    }
  }
  req.session.destroy();
  return res.render("home", {
    errMsg: "Someone tried to reset password with wrong password",
  });
};

module.exports.forgotPassword = async function (req, res) {
  return res.render("forgotPassword", { errMsg: "" });
};

module.exports.forgotPasswordPost = async function (req, res) {
  const user = await Users.findOne({ username: req.body.username });
  if (user) {
    const newPassword = generatePassword();
    const isMailSent = await mailSender.sendMail(
      user.emailId,
      newPassword,
      user.username
    );
    if (isMailSent) {
      const encryptedPassword = await bcrypt
        .genSalt(saltRounds)
        .then((salt) => {
          return bcrypt.hash(newPassword, salt);
        })
        .catch((err) => console.error(err.message));
      try {
        await Users.findByIdAndUpdate(user._id, {
          password: encryptedPassword,
        });
        return res.redirect("login");
      } catch (error) {
        console.error("Error updating password:", error);
      }
    }
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
