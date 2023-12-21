const express = require("express")

const router = express.Router()

const controller = require("../controllers/controller")

router.get("/", controller.home);
router.get("/login", controller.login);
router.get("/signup", controller.signup);

router.post("/login", controller.login);
router.post("/signup", controller.signupPost);

module.exports = router