const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Create Schema
const RechargingSchema = new Schema({  
  user:{
    type: mongoose.ObjectId,
    required:true,
    index:true
  },  

  order:{
    type:String,
    index:true
  },

  recharge_id:{
    type:String,
    index:true
  },
  createdAt: { type: Date, required: true, default: Date.now, expires: 43200 }
  
});

module.exports = Recharging = mongoose.model("recharging", RechargingSchema);
