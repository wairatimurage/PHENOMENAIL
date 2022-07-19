const router = require("express").Router();
const path = require("path");

// db models schema
const User = require("../models/userModel");
const Booking = require("../models/bookingsModel");
const Payment = require("../models/paymentModel");
const Salon = require("../models/salonModel");
const salonRoutes = require("./api/salonRoutes")(Salon, Booking);
const paymentRoutes = require("./api/paymentRoutes")(Payment);
const authRoutes = require("./api/authRoutes")(User);

// api routing
router.use("/auth", authRoutes);
router.use("/api/salon", salonRoutes);
router.use("/api/payment", paymentRoutes);

// frontend routes
router.get("/", (req, res) => res.sendFile("index.html"));
router.get("/admin", (req, res) =>
  res.sendFile(path.join(__dirname, "../frontend/admin.html"))
);
router.get("/profile", (req, res) =>
  res.sendFile(path.join(__dirname, "../frontend/profile.html"))
);
router.get("/account", (req, res) =>
  res.sendFile(path.join(__dirname, "../frontend/account.html"))
);
router.get("/booking/*", (req, res) =>
  res.sendFile(path.join(__dirname, "../frontend/checkout.html"))
);

module.exports = router;
