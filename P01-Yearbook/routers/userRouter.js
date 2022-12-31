const express = require("express");
const userRouter = express.Router();

const UserController = require("../controllers/UserController");
//const dataPath = path.join(__dirname, "../data/");
//const ProfileController = require("../controllers/ProfileController");

userRouter.get("/register", UserController.Register);
userRouter.post("/register", UserController.RegisterUser);

userRouter.get("/login", UserController.Login);
userRouter.post("/login", UserController.LoginUser);

userRouter.get("/logout", UserController.Logout);

userRouter.get("/profile", UserController.Profile);

userRouter.get("/profiles", UserController.Index);
userRouter.post("/profiles/search", UserController.Search);

// Show Create Profile Form
userRouter.get("/profile/edit", UserController.Create);
// Handle Create Profile Form Submission
userRouter.post("/profile/edit", UserController.CreateProfile);

// Show Create Profile Form
userRouter.get("/profile/edit/:id", UserController.Edit);
// Handle Create Profile Form Submission
userRouter.post("/profile/edit/:id", UserController.EditProfile);

// Show Individual Profile Details
userRouter.get("/profile/:id", UserController.Detail);

// Delete an Individual Profile
userRouter.get("/profile/:id/delete", UserController.DeleteProfileById);
userRouter.post("/profile/comment/:id", UserController.Comment);

module.exports = userRouter;
