const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Create Schema
const EnjoySchema = new Schema({  
  budget: {
    type: Number,
    required: true
  },
  winner:{
    type:String
  },
  winner_amount:{
    type:Number
  },
  loser:{
    type:String
  },
  loser_amount:{
    type:Number
  },
  joiner:
  {
    type: Number,
   
    required: true,
    index:true
  },
  recommend: {
    type: Number,
   
    required: true,
    index:true
  },
  price:{
    type: Number,
   
    required: true,
    index:true
  },
  level:{
    type:Number,
    required:true,
    index:true
  },
  // phoneDetails: {
  //   country: {
  //     type: String,
  //     max: 2,
  //     required: false,
  //   },
  //   countryCallingCode: {
  //     type: String,
  //     max: 2,
  //     required: false,
  //   },
  //   nationalNumber: {
  //     type: String,
  //     max: 13,
  //     required: false,
  //   },
  //   number: {
  //     type: String,
  //     max: 15,
  //     required: false,
  //   },
  //   verified: {
  //     type: Boolean,
  //     required: false,
  //   },
  //   verificationRequestId: {
  //     type: String,
  //     max: 50,
  //     required: false,
  //   },
  //   verificationCode: {
  //     type: String,
  //     max: 6,
  //     required: false,
  //   },
  //   createdAt: {
  //     type: Date,
  //     default: Date.now,
  //   },
  // },

  // emailVerified: {
  //   type: Boolean,
  //   required: true,
  // },

  createdAt: {
    type: String,
    index:true
  }
});

module.exports = Enjoy = mongoose.model("enjoy", EnjoySchema);
