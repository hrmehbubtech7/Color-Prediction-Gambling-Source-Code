const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Create Schema
const Bonus1Schema = new Schema({  
  better:{
    type: mongoose.ObjectId,
    required:true,
    index:true
  },
  receiver:{
    type: mongoose.ObjectId,
    required:true,
    index:true
  },
  money:{
    type:Number,
    index:true
  },
  applied:{
    type:Boolean,
    index:true,
    default:false
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
  
});

module.exports = Bonus1 = mongoose.model("bonus1", Bonus1Schema);
