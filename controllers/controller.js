const Users = require("../models/user");
const bcrypt = require("bcryptjs");
const saltRounds = 10;

module.exports.home = function (req, res) {
  return res.render("home");
};

module.exports.login = function (req, res) {
  return res.render("login");
};

module.exports.signup = function (req, res) {
  return res.render("signup");
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
    const newUser = await Users.create({
      id: len + 1,
      username: req.body.username,
      emailId: req.body.emailId,
      password: encryptedPassword,
    });
    return res.render("home");
  } catch (error) {
    console.error("Error adding user:", error);
  }
};
