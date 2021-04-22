const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Create Schema
const WithdrawlSchema = new Schema({  
  user:{
    type: mongoose.ObjectId,
    required:true,
    index:true
  },
  money:{
    type:Number,
    index:true
  },

  bank:{
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
  },
  seen:{
    type:Boolean,
    default:false
  }
});

module.exports = Withdrawl = mongoose.model("withdrawl", WithdrawlSchema);
