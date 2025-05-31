const express = require("express");
const router = express.Router();
const middleware = require("../middleware");
const userController = require("../controller/user.controller");

router.post("/login", userController.loginUser);
router.post("/sign-up", userController.registerUser);

router.get("/profile", middleware.authUser, userController.getUserProfile);
router.get("/logout", middleware.authUser, userController.logoutUser);

module.exports = router;
