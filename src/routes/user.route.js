const express = require("express");
const userRoute = express.Router();
const userControllers = require("./controllers/userController.js");
const { authoriser, requestValidators } = require("./middlewares");
const { signUpValidator, updateValidator } = requestValidators;

userRoute.get("/", userControllers.getAllUsers);
userRoute.get("/getuser/:id", userControllers.getUser);
userRoute.post("/login", userControllers.loginUser);
userRoute.post("/signup", signUpValidator, userControllers.addUser);
userRoute.put("/update/:id", updateValidator, userControllers.updateUser);
userRoute.delete("/delete/:id", userControllers.deleteUser);
userRoute.get("/me/profile", authoriser, userControllers.protectedUser);

module.exports = userRoute;
