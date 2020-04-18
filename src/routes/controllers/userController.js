const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../../db/Users/User.model");
const jwt = require("js");
const path = require("path");
const fs = require("fs");
const validateInput = require("../../utils/validator");
module.exports = class userController {
  static async getAllUsers(req, res) {
    try {
      const users = await User.find({}, { tokens: 0, tokenLife: 0 });
      res.json({ success: true, users });
    } catch (err) {
      res.json({ success: false, error: err });
    }
  }
  static async getUser(req, res) {}
  static async addUser(req, res) {}
  static async loginUser(req, res) {
    const username = req.body.username || req.body.email;
    try {
      const user = await User.getByValidCredentials(
        username,
        req.body.password
      );

      if (!user) {
        throw "invalid credentials";
      }
      const day = new Date();
      user.lastLogin = `${day.getDate()}-${
        day.getMonth() + 1
      }-${day.getFullYear()}-${day.toLocaleTimeString()}`;
      const token = await user.generateAuthToken(); //lol generate token automatically saves the user
      return res.json({
        AUTH: "true",
        token,
        message: "you have been succesfully logged in",
      });
    } catch (err) {
      return res.status(401).json({
        success: "false",
        err,
      });
    }
  }
  static async updateUser(req, res) {
    try {
      //save user with valid entries
      const user = await User.findOne({ _id: req.params.id });
      if (!user) {
        throw "user does not exist";
      }
      if (req.body.username || req.body.email) {
        const existingUser = await User.find({
          $and: [
            { $or: [{ email: req.body.email }, { name: req.body.username }] },
            { _id: { $ne: user._id } },
          ],
        });
        if (existingUser.length > 0) {
          throw "user with credential already exist";
        }
      }
      user.name = req.body.username || user.name;
      user.email = req.body.email || user.email;
      user.password = req.body.password || user.password;
      user.names = req.body.names || user.names;
      const test = await user.save();
      if (!test) {
        throw "could not update user";
      }
      return res.json({
        success: true,
        user: {
          _id: test._id,
          email: test.email,
          username: test.name,
          date: test.date,
          time: test.time,
          names: test.names,
        },
        message: "user updated succesfully",
      });
    } catch (err) {
      res.json({ success: false, error: err });
    }
  }
  static async deleteUser(req, res) {
    try {
      const user = await User.findByIdAndDelete({ _id: req.params.id });
      if (!user) {
        throw `user ${req.params.id} could not be deleted`;
      }
      return res.json({
        success: true,
        message: `user ${user.name} was deleted successfully`,
      });
    } catch (err) {
      return res.status(401).json({
        success: false,
        error: err,
      });
    }
  }
  static async protectedUser(req, res) {
    res.json(req.user);
  }
  static getLogs(req, res) {
    fs.readFile(path.join(__dirname, "../../logger/logs.txt"), (err, log) => {
      if (err) {
        console.err(err);
      }
      res.send(log);
    });
  }
};
