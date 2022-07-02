const { Schema, model } = require("mongoose");

const bookingModel = new Schema({
  salon: { type: Object },
  client: { type: Object },
  appontment: { type: Object },
  time: { type: Date },
});

module.exports = model("Booking", bookingModel);
