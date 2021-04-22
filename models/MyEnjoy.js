const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Create Schema
const MyEnjoySchema = new Schema({  
  period: {
    type: Number,
    required: true,
    index:true
  },

  contract:
  {
    type: Number,
   
    required: true,
    index:true
  },
  select: {
    type: Number,
   
    required: true,
    index:true
  },
  result:{
    type: Number,
   
    required: true,
    index:true
  },
  amount:{
    type:Number,
    required:true,
    index:true
  },
  user:{
    type: mongoose.ObjectId,
    ref:"user",
    required:true,
    index:true
  },
  category:{
    type:Number,
    required:true,
    index:true
  }
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

});
MyEnjoySchema.set('toJSON', { getters: true });
MyEnjoySchema.options.toJSON.transform = (doc, ret) => {
  const obj = { ...ret };
  delete obj.__v;
  return obj;
};
module.exports = MyEnjoy = mongoose.model("my_enjoy", MyEnjoySchema);
