const User = require("../models/User");
const Visited=require("../models/Visited");
const MyEnjoy=require("../models/MyEnjoy");
const Reward=require("../models/Reward");
const Recharge = require("../models/Recharge");
const Withdrawl=require('../models/Withdrawl');
const Toss=require('../models/Toss');
exports.getTotal =async (req, res, next) => {
    const visits=await Visited.countDocuments({});
    const users=await User.countDocuments({});
    let revenue=await MyEnjoy.find();
    let revenue1=await Toss.find();
    revenue1=revenue1.reduce((all, ele) => all + parseFloat(ele.profit), 0);
    revenue1=-Number(revenue1.toFixed(2));
    revenue=revenue.reduce((all, ele) => all + parseFloat(ele.amount), 0);
    revenue=-Number(revenue.toFixed(2))+revenue1;
    let rewards=await Reward.find({status:true});
    rewards=Number(rewards.reduce((all, ele) => all + parseFloat(ele.money), 0).toFixed(2));
    return res.status(200).json({visits, users, revenue, rewards});
};
exports.getRevenue =async (req, res, next) => {
    let fromDate=new Date(req.params.from);
    const toDate=new Date(req.params.to);
    const dates=Math.ceil((toDate-fromDate)/(3600000*24));
    const data=[];
    for(let i=0;i<=dates;i++){
        const dateString=""+fromDate.getFullYear()+(fromDate.getMonth()+1)+fromDate.getDate();
        // console.log(dateString);
        const revenue=await MyEnjoy.find({period:{$gte:parseInt(dateString)*10000,$lte:parseInt(dateString)*10000+9999}});
        data.push(-revenue.reduce((all, ele) => all + parseFloat(ele.amount), 0));
        fromDate.setDate(fromDate.getDate()+1);
    }    
    return res.json(data);
};
exports.getRevenue1 =async (req, res, next) => {
    let fromDate=new Date(req.params.from);
    const toDate=new Date(req.params.to);
    const dates=Math.ceil((toDate-fromDate)/(3600000*24));
    const data=[];
    for(let i=0;i<=dates;i++){
        const nextDate=new Date(fromDate);
        nextDate.setDate(nextDate.getDate()+1);
        // console.log(nextDate);
        const revenue=await Toss.find({createdAt:{$lt:nextDate,$gte:fromDate}});
        data.push(-revenue.reduce((all, ele) => all + parseFloat(ele.profit), 0));
        fromDate.setDate(fromDate.getDate()+1);
    }    
    return res.json(data);
};
exports.getVisit =async (req, res, next) => {
    let fromDate=new Date(req.params.from);
    const toDate=new Date(req.params.to);
    const dates=Math.ceil((toDate-fromDate)/(3600000*24));
    const visits=[];
    const users=[];
    for(let i=0;i<=dates;i++){
        const nextDate=new Date(fromDate);
        nextDate.setDate(nextDate.getDate()+1);
        // console.log(nextDate);
        const visit=await Visited.countDocuments({createdAt:{$lt:nextDate,$gte:fromDate}});
        const user=await User.countDocuments({createdAt:{$lt:nextDate,$gte:fromDate}});
        visits.push(visit);
        users.push(user);
        fromDate.setDate(fromDate.getDate()+1);
    }    
    return res.json({visits, users});
};
exports.getRWS =async (req, res, next) => {
    let fromDate=new Date(req.params.from);
    const toDate=new Date(req.params.to);
    const dates=Math.ceil((toDate-fromDate)/(3600000*24));
    const rewards=[];
    const recharges=[];
    const withdrawals=[];
    for(let i=0;i<=dates;i++){
        const nextDate=new Date(fromDate);
        nextDate.setDate(nextDate.getDate()+1);
        // console.log(nextDate);
        const reward=await Reward.find({createdAt:{$lt:nextDate,$gte:fromDate},status:true});
        const recharge=await Recharge.find({createdAt:{$lt:nextDate,$gte:fromDate},status:1});
        const withdrawal=await Withdrawl.find({createdAt:{$lt:nextDate,$gte:fromDate},status:3});
        rewards.push(reward.reduce((all, ele) => all + parseFloat(ele.money), 0).toFixed(2));
        recharges.push(recharge.reduce((all, ele) => all + parseFloat(ele.money), 0).toFixed(2));
        withdrawals.push(withdrawal.reduce((all, ele) => all + parseFloat(ele.money), 0).toFixed(2));
        fromDate.setDate(fromDate.getDate()+1);
    }    
    return res.json({rewards, recharges, withdrawals});
};