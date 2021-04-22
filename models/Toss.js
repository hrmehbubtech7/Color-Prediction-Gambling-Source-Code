const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Create Schema
const TossSchema = new Schema({  
  bet: {
    type: Number,
    required: true
  },
  profit:{
    type: Number,
    required: true
  },
  userid:{
    type: mongoose.ObjectId,
    required:true,
    index:true
  },
  phone:{
    type:String
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
});

module.exports = Toss = mongoose.model("toss", TossSchema);
