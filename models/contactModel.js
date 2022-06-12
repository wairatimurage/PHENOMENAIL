const { Schema, model } = require("mongoose");

const contactModel = new Schema({
  fullName: { type: String },
  email: { type: String },
  message: { type: String },
  date: { type: Date },
});

module.exports = model("Contact", contactModel);
