const { Schema, model } = require("mongoose");

const salonModel = new Schema({
  name: { type: String, required: true },
  wallet: { type: Object },
  location: { type: Object },
  email: { type: String, required: true },
  password: {
    type: String,
    required: true,
  },
  operationalHours: { type: Object },
  appointments: { type: Array, default: [] },
});

module.exports = model("Salon", salonModel);
