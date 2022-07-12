const { Schema, model } = require("mongoose");

const salonModel = new Schema({
  name: { type: String, required: true },
  wallet: { type: Object, default: { balance: 0, withdrawn: 0, deposit: 0 } },
  location: { type: Object },
  email: { type: String, required: true },
  password: {
    type: String,
  },
  operationalHours: { type: Object },
  appointments: { type: Array, default: [] },
});

module.exports = model("Salon", salonModel);
