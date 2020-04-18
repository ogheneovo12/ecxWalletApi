const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    trim: true,
    required: "true",
  },
  email: {
    type: String,
    trim: true,
    lowercase: true,
    required: true,
    unique: true,
    validate: (value) => {
      if (!validateInput(null, "email")(value)) {
        throw new Error("inavlid Email");
      }
    },
  },
  password: {
    type: String,
    required: true,
    minLength: 5,
  },
  tokens: [
    {
      token: {
        type: String,
        required: true,
      },
    },
  ],
  names: {
    type: Array,
    default: [],
  },
  occupation: {
    type: String,
    trim: true,
    lowercase: true,
    default: "not stated",
  },
  time: {
    type: String,
    required: true,
  },
  lastLogin: {
    type: String,
    default: "never",
  },
  date: {
    type: String,
    required: true,
  },
  tokenLife: {
    type: Number,
    default: 600,
  },
});
userSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, saltRounds);
  }
  next();
});
userSchema.methods.generateAuthToken = async function () {
  const token = jwt.sign({ _id: this.email }, JWT_KEY, {
    expiresIn: this.tokenLife,
  });
  this.tokens = this.tokens.concat({ token });
  this.save();
  return token;
};
userSchema.statics.getByValidCredentials = async (username, password) => {
  const user = await User.findOne({
    $or: [{ email: username }, { name: username }],
  });
  if (!user) {
    throw "user not found, please signup or check login details";
  }
  const passwordVerify = await bcrypt.compare(password, user.password);
  if (!passwordVerify) {
    throw "password is invalid";
  }
  return user;
};

const User = mongoose.model("User", userSchema);
module.exports = User;
