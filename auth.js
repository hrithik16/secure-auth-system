module.exports.isAlreadyLoggedIn = async (req, res, next) => {
  try {
    if (req.session.userId) return res.redirect("/dashboard");
    next();
  } catch (error) {
    console.log(error.message);
  }
};

module.exports.isNotLoggedIn = async (req, res, next) => {
  try {
    if (!req.session.userId) return res.redirect("/");
    next();
  } catch (error) {
    console.log(error.message);
  }
};
