const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Create Schema
const RechargeSchema = new Schema({  
  user:{
    type: mongoose.ObjectId,
    required:true,
    index:true
  },
  phone:{
    type:String,
    index:true
  },
  money:{
    type:Number,
    index:true
  },

  orderID:{
    type:String,
    index:true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  status:{
    type:Number,
    default:0,
    index:true
  }
  
});

module.exports = Recharge = mongoose.model("recharge", RechargeSchema);
