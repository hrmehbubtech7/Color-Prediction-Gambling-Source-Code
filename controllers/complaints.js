const bcrypt = require("bcryptjs");
const Complaints = require("../models/Complaints");
const Withdrawls = require("../models/Withdrawl");

const jwt = require("jsonwebtoken");
const { Console } = require("console");

exports.getNewComplaintsAdmin =async (req, res, next) => {
    const complaints=await Complaints.find({status:false});
    const withdrawals=await Withdrawls.find({status:0});
    return res.status(200).json({complaints:complaints.length, withdrawals:withdrawals.length});
    
};

exports.getNewComplaints =async (req, res, next) => {
    const complaints=await Complaints.find({user:req.userFromToken._id,view_status:false,status:true});
    const withdrawals=await Withdrawls.find({user:req.userFromToken._id,status:{$ne:0}, seen:false});

    return res.status(200).json({complaints:complaints.length, withdrawals:withdrawals.length});
    
};

exports.getComplaints =async (req, res, next) => {
    const page = req.params.page;
    let data,total;
    if(req.params.status==0){
        data=await Complaints.find({status:false,user:req.userFromToken._id}).skip((page-1)*20).limit(20);
        total=await Complaints.countDocuments({status:false,user:req.userFromToken._id});
    }else{
        data=await Complaints.find({status:true,user:req.userFromToken._id}).skip((page-1)*20).limit(20);
        total=await Complaints.countDocuments({status:true,user:req.userFromToken._id});
    }

    return res.status(200).json({data:data,page,last_page:Math.ceil(total / 20)});
    
};


exports.postComplaints = (req, res, next) => {
    const comp={};
    comp.user=req.userFromToken._id;
    comp.category=req.body.category;
    comp.period=parseInt(req.body.period);
    comp.whatsapp=req.body.whatsapp;
    comp.content=req.body.content;
    comp.state=0;
    new Complaints(comp).save((err,user)=>{
        // console.log(err);
        return res.status(200).json({message:"Send succesfully"});
    });

};

exports.putComplaints =async (req, res, next) => {
    const data=await Complaints.findById(req.body.id);
    if(data.status==true)
        data.view_status=true;
    await data.save();
    return res.status(200).json({data});    
};
exports.getComplaintsAdmin =async (req, res, next) => {
    const page = req.params.page;
    let data,total;

    if(req.params.status==0){
        data=await Complaints.find({status:false}).populate('user').skip((page-1)*20).limit(20);
        total=await Complaints.countDocuments({status:false});
    }else{
        data=await Complaints.find({status:true}).populate('user').skip((page-1)*20).limit(20);
        total=await Complaints.countDocuments({status:true});
    }

    return res.status(200).json({data:data,page,last_page:Math.ceil(total / 20)});   
    
};
exports.postComplaintsAdmin = (req, res, next) => {
   
    Complaints.findById(req.body.id,(err,data)=>{
        // console.log(req.body.reply);
        data.reply=req.body.reply;
        data.status=true;
        data.save((err,user)=>{
            // console.log(err);
            return res.status(200).json({message:"success"});
        });
    });
        

};