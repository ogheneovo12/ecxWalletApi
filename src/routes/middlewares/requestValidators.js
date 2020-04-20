const validateInput = require("../../utils/validator");
const CONFIG = require("../../config/index.config");
const bcrypt = require('bcrypt')
const signUpValidator = (req, res, next) => {
  const errors = validateInput([
    { type: "email", value: req.body.email },
    { type: "password", value: req.body.password },
    { type: "pin", value: req.body.pin },
    { type: "username", value: req.body.username },
  ]);
  if (errors) {
    return res.json({ success: "false", errors });
  }
  next();
};

const updateValidator = async (req, res, next) => {
  if (
    req.body.password &&
    !validateInput(null, "password")(req.body.password)
  ) {
    return res.status(401).json({ success: false, error: "invalid password" });
  }
  if (
    req.body.username &&
    !validateInput(null, "username")(req.body.username)
  ) {
    return res.status(401).json({ success: false, error: "invalid username" });
  }
  if (req.body.email && !validateInput(null, "email")(req.body.email)) {
    return res.status(401).json({ success: false, error: "inavlid email" });
  }
  next();
};
module.exports = { signUpValidator, updateValidator };
