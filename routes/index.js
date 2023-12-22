const express = require("express")
const session = require("express-session")
const router = express.Router()
const controller = require("../controllers/controller")
const auth = require("../auth")
router.use(session({secret: "mysecret"}))



router.get("/", controller.home);
router.get("/login",auth.isAlreadyLoggedIn, controller.login);
router.get("/signup",auth.isAlreadyLoggedIn, controller.signup);
router.get("/dashboard",auth.isNotLoggedIn, controller.dashboard);
router.get("/reset",auth.isNotLoggedIn, controller.reset);
router.get("/logout",auth.isNotLoggedIn, controller.logout);

router.post("/login", controller.loginPost);
router.post("/signup", controller.signupPost);
router.post("/resetPost", controller.loginPost);

module.exports = router