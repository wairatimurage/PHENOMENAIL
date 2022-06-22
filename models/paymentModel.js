const mongoose = require("mongoose");
const { Schema } = mongoose;

const paymentModel = new Schema({
  refId: { type: String, unique: true },
  order: { type: Object, required: true },
  clientId: { type: String, required: true },
  initiatedAt: { type: Date, required: true },
  completed: { type: Boolean, required: true, default: false },
  currency: { type: String, required: true },
  bookingFee: { type: Number, required: true },
  totalPayable: { type: Number, required: true },
  payment: { type: Object },
});

module.exports = mongoose.model("Payment", paymentModel);
