const express = require("express");
const bcrypt = require("bcrypt");
const passport = require("passport");
const { CustomError, getUserByEmail, checkAuth } = require("../../utility");

const authRoutes = (User) => {
  const authRouter = express.Router();

  authRouter.route("/login").post(
    passport.authenticate("local", {
      successRedirect: "/",
      failureRedirect: "/",
    })
  );

  // registration endpoint for all account types
  authRouter.route("/register").post(async (req, res) => {
    // request body must contain a password, username and accountType based on account type to be created
    try {
      const salt = await bcrypt.genSalt();
      if (req.body.password !== req.body.cPassword) {
        throw new CustomError("Password Mismatch.", "Password Mismatch");
      }
      if (!req.body.password || !req.body.email) {
        throw new CustomError(
          "Password and username required.",
          "Missing Field"
        );
      }
      // check if username already in use
      const userExists = await getUserByEmail(req.body.username);
      if (userExists) {
        return res.status(400).json({ message: "Username already in use" });
      }
      const hashedPassword = await bcrypt.hash(req.body.password, salt);
      const user = new User({
        ...req.body,
        password: hashedPassword,
      });
      user.save((err) => {
        if (err) throw err;
      });
      return res.status(201).redirect("/");
      // .json({ message: user.username + " account successfully created." });
    } catch (error) {
      res.json({ error: error.message, code: error.name });
    }
  });

  authRouter.route("/logout").delete((req, res) => {
    req.logOut();
    req.redirect("/login");
  });

  authRouter.route("/current-user").get(checkAuth, async (req, res) => {
    try {
      if (req.user) {
        return res.status(200).json(req.user);
      }
    } catch (_err) {
      console.log(_err);
      return res
        .status(500)
        .json({ errorMessage: _err.message, code: _err.name });
    }
  });

  return authRouter;
};

module.exports = authRoutes;
