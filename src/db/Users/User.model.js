const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const validateInput = require("../../utils/validator");
const CONFIG = require("../../config/index.config");
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    trim: true,
    required: "true",
  },
  isAdmin: {
    type: Number,
    default: 0,
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
  signedUp_at: {
    type: Date,
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
  lastLogin: {
    type: String,
    default: "never",
  },
  tokenLife: {
    type: Number,
    default: 600,
  },
  amount: {
    type: Number,
    default: 5000,
  },
  phonenumber: {
    type: String,
    required: true,
    unique: true,
  },
  transactionLogs: {
    type: Array,
    default: [],
  },
  transactionPin: {
    type: String,
    minlength: 4,
    required: true,
  },
});

userSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, CONFIG.saltRounds);
  }
  if (this.isModified("transactionPin")) {
    this.transactionPin = await bcrypt.hash(
      this.transactionPin,
      CONFIG.saltRounds
    );
  }
  next();
});

userSchema.methods.generateAuthToken = async function () {
  const token = jwt.sign({ _id: this.email }, CONFIG.SECRET, {
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
    throw { message: "user not found, please signup or check login details" };
  }
  const passwordVerify = await bcrypt.compare(password, user.password);
  if (!passwordVerify) {
    throw { message: "password is invalid" };
  }
  return user;
};
userSchema.statics.checkIfregisteredMember = async (phonenumber) => {
  const registeredUser = await User.findOne({ phonenumber });
  if (!registeredUser) {
    throw { message: "recipient is not registered on the platform" };
  }
  return registeredUser;
};
userSchema.methods.credit = async function (amount, sender) {
  try {
    this.amount = Math.floor(this.amount + amount);
    await this.save();
    this.logTransaction({
      Date: new Date().toLocaleString(),
      type: "credit",
      amount,
      status: "succesfull",
      sender: sender,
      info: "recieved",
    });
  } catch (err) {
    throw { message: `transaction unsuccesfull ${err.mesage} ` };
  }
};
userSchema.methods.debit = async function (amount, recipient, pin) {
  try {
    const pinVerify = await bcrypt.compare(pin, this.transactionPin);
    if (!pinVerify) {
      throw { message: "pin is invalid" };
    }
    if (this.amount < amount) {
      throw { message: "insufficient fund" };
    }
    this.amount = this.amount - amount;
    await this.save();
    this.logTransaction({
      Date: new Date().toLocaleString(),
      type: "debit",
      amount,
      recipient: recipient,
      status: "succesfull",
      info: "sent",
    });
  } catch (err) {
    this.logTransaction({
      Date: new Date().toLocaleString(),
      type: "debit",
      amount,
      status: "unsuccesfull",
      recipient: recipient,
      info: err.message,
    });
    throw { message: `transaction unsuccesfull ${err.message} ` };
  }
};
userSchema.methods.getTransactionHistory = function (user) {
  const History = this.transactionLogs.sort(
    (a, b) => new Date(b.Date) - new Date(a.Date)
  );
  return History;
};
userSchema.methods.logTransaction = async function (History) {
  try {
    this.transactionLogs.push(History);
    await this.save();
  } catch (err) {
    throw { message: err };
  }
};

const User = mongoose.model("User", userSchema);
module.exports = User;
