const { Schema, model } = require("mongoose");

const userModel = new Schema({
  username: { type: String },
  email: { type: String, required: true },
  password: {
    type: String,
    required: true,
  },
  wallet: { type: Object },
  appointments: { type: Array, default: [] },
});

module.exports = model("User", userModel);
