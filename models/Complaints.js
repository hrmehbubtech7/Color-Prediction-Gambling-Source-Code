const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Create Schema
const ComplaintsSchema = new Schema({  
  user:{
    type: mongoose.ObjectId,
    required:true,
    index:true,
    ref:'user'
  },
  status:{
    type:Boolean,
    index:true,
    default:false
  },
  view_status:{
    type:Boolean,
    index:true,
    default:false
  },
  category:{
    type:String,
    required:true,
    index:true
  },
  period:{
    type:Number,
    required:true,
    index:true
  },
  whatsapp:{
    type:Number,
    index:true
  },
  content:{
    type:String,
    required:true,
    index:true
  },
  reply:{
    type:String,
    index:true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  
});

module.exports = Complaints = mongoose.model("complaint", ComplaintsSchema);
