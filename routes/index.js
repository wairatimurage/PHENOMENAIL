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

module.exports = router;
