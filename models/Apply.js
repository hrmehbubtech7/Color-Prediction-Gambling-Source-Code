const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Create Schema
const ApplySchema = new Schema({  
  user:{
    type: mongoose.ObjectId,
    required:true,
    index:true
  },
  money:{
    type:Number,
    index:true
  },
  level:{
    type:Number,
    index:true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
  
});

module.exports = Apply = mongoose.model("apply", ApplySchema);
