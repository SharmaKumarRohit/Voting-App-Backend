const express = require("express");
const router = express.Router();
const {
  userSignup,
  userLogin,
  userProfile,
  updatePassword,
} = require("../controllers/userController");
const { jwtAuthMiddleware } = require("../jwt");

router.post("/signup", userSignup);
router.post("/login", userLogin);
router.get("/profile", jwtAuthMiddleware, userProfile);
router.put("/profile/password", jwtAuthMiddleware, updatePassword);

module.exports = router;
