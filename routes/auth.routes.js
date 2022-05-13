const { Router } = require("express");
const { check } = require("express-validator");
const {
  login,
  loginGoogle,
  renewToken,
} = require("../controllers/auth.controllers");
const { fieldValidator } = require("../middlewares/fields-validator");
const jwtValidator = require("../middlewares/jwt-validator");

const router = Router();

router.post(
  "/login",
  [
    check("email", "Email is required").isEmail(),
    check("password", "Password is required").not().isEmpty(),
    fieldValidator,
  ],
  login
);

router.post(
  "/login/google",
  [check("token", "Google token is required").not().isEmpty(), fieldValidator],
  loginGoogle
);

router.get("/renew", jwtValidator, renewToken);

module.exports = router;
