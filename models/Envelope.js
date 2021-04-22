const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Create Schema
const EnvelopeSchema = new Schema({
  count: {
    type: Number,
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  createdBy: {
    type: mongoose.ObjectId,
    required: true,
    ref: 'user',
    index: true
  },
  awarding: [{
    type: mongoose.ObjectId,
    ref: 'user',
  }],
  createdAt: {
    type: Date,
    default: Date.now,
  },
  status: {
    type: Boolean,
    default: false
  }

});

module.exports = Envelope = mongoose.model("envelope", EnvelopeSchema);
