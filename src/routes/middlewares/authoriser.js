const CONFIG = require("../../config/index.config");
const User = require("../../db/Users/User.model");
const jwt = require("jsonwebtoken");
const authoriser = async (req, res, next) => {
  //i would have loved to use the callback but i was avoiding too much callback
  //so i used try..catch instead
  try {
    let token = req.header("Authorization");
    if (token) {
      token = token.replace("Bearer ", "");
    } else {
      return res.status(401).json({
        AUTH: false,
        message: "Not authorized to access this resource",
      });
    }
    const sender = jwt.verify(token, CONFIG.SECRET);
    const user = await User.findOne({ email: sender._id });
    //token must match the user, if not prevent access
    if (!user || req.body.LoginEmail != user.email) {
      throw { message: "Not authorized to access this resource" };
    }
    req.user = user;
    req.token = token;
  } catch (err) {
    if (err.message.startsWith("jwt")) {
      err.message = err.message.replace("jwt", "token");
    }
    return res.status(401).json({ AUTH: false, error: err.message });
  }
  next();
};
module.exports = authoriser;
