const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../../db/Users/User.model");
const path = require("path");
const fs = require("fs");
const validateInput = require("../../utils/validator");
module.exports = class userController {
  static async getAllUsers(req, res) {
    try {
      const users = await User.find({}, { tokens: 0, tokenLife: 0 });
      res.json({ success: true, users });
    } catch (err) {
      res.json({ success: false, error: err.message });
    }
  }
  static async getUser(req, res) {
    User.findById({ _id: req.params.id })
      .then((user) => {
        const { _id, email, name, names, occupation, lastLogin } = user;
        res.json({
          success: true,
          user: { _id, email, name, names, occupation, lastLogin },
        });
      })
      .catch((err) => {
        return res.status(401).json({
          success: false,
          error: `could not get user ${req.params.id} `,
        });
      });
  }
  static async addUser(req, res) {
    try {
      const existingUser = await User.findOne({
        $or: [{ email: req.body.email }, { name: req.body.username }],
      });
      if (existingUser) {
        throw { message: "user already exists" };
      }
      const day = new Date();
      const { username, email, password, names, occupation } = req.body;
      const user = new User({
        name: username,
        email,
        password,
        signedUp_at: day.toLocaleString(),
        date: `${day.getDate()}-${day.getMonth() + 1}-${day.getFullYear()}`,
        time: day.toLocaleTimeString(),
        names,
        occupation,
      });
      const itSaved = await user.save();
      if (!itSaved) throw "could not create user";
      const token = await user.generateAuthToken();
      return res.json({
        success: "true",
        message: "Account has been succesfully registered",
      });
    } catch (err) {
      return res.json({
        success: "false",
        error: err.message,
      });
    }
  }
  static async loginUser(req, res) {
    const username = req.body.username || req.body.email;
    try {
      const user = await User.getByValidCredentials(
        username,
        req.body.password
      );

      if (!user) {
        throw { message: "invalid credentials" };
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
        error: err.message,
      });
    }
  }
  static async updateUser(req, res) {
    try {
      //save user with valid entries
      const user = await User.findOne({ _id: req.params.id });
      if (!user) {
        throw { message: "user does not exist" };
      }
      if (req.body.username || req.body.email) {
        const existingUser = await User.find({
          $and: [
            { $or: [{ email: req.body.email }, { name: req.body.username }] },
            { _id: { $ne: user._id } },
          ],
        });
        if (existingUser.length > 0) {
          throw { message: "user with credential already exist" };
        }
      }
      user.name = req.body.username || user.name;
      user.email = req.body.email || user.email;
      user.password = req.body.password || user.password;
      user.names = req.body.names || user.names;
      const test = await user.save();
      if (!test) {
        throw { message: "could not update user" };
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
      res.json({ success: false, error: err.message });
    }
  }
  static async deleteUser(req, res) {
    try {
      const user = await User.findByIdAndDelete({ _id: req.params.id });
      if (!user) {
        throw { message: `user ${req.params.id} could not be deleted` };
      }
      return res.json({
        success: true,
        message: `user ${user.name} was deleted successfully`,
      });
    } catch (err) {
      return res.status(401).json({
        success: false,
        error: err.message,
      });
    }
  }
  static async protectedUser(req, res) {
    res.json(req.user);
  }
};
