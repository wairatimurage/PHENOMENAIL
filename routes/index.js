const router = require("express").Router();
const path = require("path");
const User = require("../models/userModel");
// const userRoutes = require("./api/userRoutes")(User);
const authRoutes = require("./api/authRoutes")(User);

// api routing
router.use("/auth", authRoutes);
// router.use("/api/user")

// frontend routes

router.get("/", (req, res) => res.sendFile("index.html"));

module.exports = router;
