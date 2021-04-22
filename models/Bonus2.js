const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Create Schema
const Bonus2Schema = new Schema({  
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

module.exports = Bonus2 = mongoose.model("bonus2", Bonus2Schema);
