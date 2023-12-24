const express = require("express");
const session = require("express-session");
const router = express.Router();
const controller = require("../controllers/controller");
const auth = require("../auth");
router.use(session({ secret: process.env.SECRET }));

router.get("/", controller.home);
router.get("/login", auth.isAlreadyLoggedIn, controller.login);
router.get("/signup", auth.isAlreadyLoggedIn, controller.signup);
router.get("/dashboard", auth.isNotLoggedIn, controller.dashboard);
router.get("/reset", auth.isNotLoggedIn, controller.reset);
router.get("/logout", auth.isNotLoggedIn, controller.logout);
router.get("/forgotPassword", auth.isAlreadyLoggedIn, controller.forgotPassword);

router.post("/login",auth.isAlreadyLoggedIn, controller.loginPost);
router.post("/signup",auth.isAlreadyLoggedIn, controller.signupPost);
router.post("/resetPost",auth.isNotLoggedIn, controller.resetPost);
router.post("/forgotPassword", auth.isAlreadyLoggedIn, controller.forgotPasswordPost);

module.exports = router;
