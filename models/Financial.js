const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Create Schema
const FinancialSchema = new Schema({
  type:{
    type:String,
    enum:["Recharge","Withdrawal","Reward","Betting","Referral1","Referral2","Envelope", "Toss"]
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  amount:{
    type:Number
  },
  details:{
    type:Object
  }
});

module.exports =FinancialSchema;
