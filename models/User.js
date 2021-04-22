const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const FinancialSchema=require('./Financial');
// Create Schema
const UserSchema = new Schema({
  phone: {
    type: String,
    required: true,
    index: true
  },
  heads: {
    type: Number,
    default:0
  },
  tails: {
    type: Number,
    default:0
  },
  admin: {
    type: Boolean,
    default: false
  },
  superAdmin: {
    type: Boolean,
    default: false
  },
  nickname: {
    type: String,
    default: "member",
    required: true
  },
  password: {
    type: String,
    min: 8,
    max: 50,
    required: true
  },
  recommendationCode:
  {
    type: Number,

  },
  phone_verified: {
    type: Boolean,
    default: false
  },
  otp: {
    type: String
  },
  otp_time:{
    type: Date,
  },
  otp_tried:{
    type:Number,
    default:0
  },
  budget:
  {
    type: Number,
    default: 0,
    required: true
  },
  refer2: {
    type: mongoose.ObjectId,
    ref: 'user'
  },
  refer1: {
    type: mongoose.ObjectId,
    ref: 'user'
  },
  refered2: {
    type: Array
  },
  refered1: {
    type: Array
  },
  bank_card: {
    type: Array
  },
  email: {
    type: String
  },
  withdrawals:{
    type:Number,
    default:0
  },
  bets:{
    type:Number,
    default:0
  },
  recharged:{
    type:Boolean,
    default:false
  },
  financials:[FinancialSchema],   
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
  updatedAt: {
    type: Number,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});
UserSchema.set('toJSON', { getters: true });
UserSchema.options.toJSON.transform = (doc, ret) => {
  const obj = { ...ret };
  delete obj.__v;
  delete obj.password;
  return obj;
};
module.exports = User = mongoose.model("user", UserSchema);
