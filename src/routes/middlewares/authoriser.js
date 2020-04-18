const authoriser = async (req, res, next) => {
  let token = req.header("Authorization");
  if (token) {
    token = token.replace("Bearer ", "");
  } else {
    return res
      .status(401)
      .json({ AUTH: false, message: "Not authorized to access this resource" });
  }
  //i would have loved to use the callback but i was avoiding too much callback
  //so i used try..catch instead
  try {
    const sender = jwt.verify(token, JWT_KEY);
    const user = await User.findOne({ email: sender._id });

    //token must match the user, if not prevent access
    if (!user || req.body.email != user.email) {
      throw "Not authorized to access this resource";
    }
    const { name, email, signedUp_at, date, time } = user;
    const day = new Date(signedUp_at);
    req.user = { _id: user._id, name, email, date, time };
    req.token = token;
    next();
  } catch (error) {
    if (error.message.startsWith("jwt")) {
      error = error.message.replace("jwt", "token");
    }
    return res.status(401).json({ AUTH: false, error });
  }
};
module.exports = authoriser;
