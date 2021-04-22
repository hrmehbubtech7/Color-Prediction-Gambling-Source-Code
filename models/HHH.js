const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Create Schema
const HHHSchema = new Schema({  
  user:{
    type: mongoose.ObjectId,
    required:true,
    index:true
  },
  phone: {
    type: String,
    required: true,
    index: true
  },
  money:{
    type:Number,
    index:true
  },
 
  createdAt: {
    type: Date,
    default: Date.now
  }
  
});

module.exports = HHH = mongoose.model("hhh", HHHSchema);
