const Users = require("../models/user");
const bcrypt = require("bcryptjs");
const saltRounds = 10;

module.exports.home = function (req, res) {
  return res.render("home");
};

module.exports.dashboard = function (req, res) {
  return res.render("dashboard");
};

module.exports.reset = function (req, res) {
  return res.render("reset");
};

module.exports.login = function (req, res) {
  return res.render("login");
};

module.exports.signup = function (req, res) {
  return res.render("signup");
};

module.exports.logout = function (req, res) {
  req.session.destroy()
  return res.render("home");
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

module.exports.loginPost = async function (req, res) {
  try {
    const user = await Users.findOne({ username: req.body.username });

    if (user) {
      console.log('coming here')
      const isPasswordValid = await isPasswordCorrect(
        req.body.password,
        user.password
      );

      if (isPasswordValid) {
        // Password is correct, proceed with login logic
        console.log("Login successful");
        req.session.userId = user.id
        return res.render("dashboard");
      } else {
        console.log("Invalid password");
        return res.render("login");
      }
    } else {
      console.log("User not found");
      return res.render("login");
    }
  } catch (error) {
    console.error("Error during login:", error);
  }
};

module.exports.resetPost = async function(req, res){

}

async function isPasswordCorrect(userPassword, dbPassword) {
  const isPasswordValid = await bcrypt.compare(userPassword, dbPassword);
  return isPasswordValid;
}
