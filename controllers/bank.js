const User = require("../models/User");
const Withdrawl = require("../models/Withdrawl");
const bcrypt = require("bcryptjs");
const Recharge = require("../models/Recharge");
const HHH = require("../models/HHH");
const Bonus1 = require("../models/Bonus1");
const jwt = require("jsonwebtoken");
const https = require("https");
/*
 * import checksum generation utility
 * You can get this utility from https://developer.paytm.com/docs/checksum/
 */
const PaytmChecksum = require("../helpers/PaytmChecksum");

exports.postBank = (req, res, next) => {
  const comp = req.body;
  // console.log(comp);
  User.findById(req.userFromToken._id, (err, user) => {
    user.bank_card.push(comp);
    user.save();
    return res.status(200).json({ message: "Add succesfully" });
  });
  // new Complaints(comp).save((err,user)=>{
  //     console.log(err);
  //     return res.status(200).json({message:"Send succesfully"});
  // });
};
exports.deleteBank = (req, res, next) => {
  const key = req.body.key;
  User.findById(req.userFromToken._id, (err, user) => {
    user.bank_card.splice(key, 1);

    user.save();
    return res.status(200).json({ message: "Remove succesfully" });
  });

  // new Complaints(comp).save((err,user)=>{
  //     console.log(err);
  //     return res.status(200).json({message:"Send succesfully"});
  // });
};

exports.postWithdrawl = async (req, res, next) => {
  const amount = Math.abs(parseFloat(req.body.amount));
  if (amount < 31)
    return res.status(400).json({ error: "Only more than ₹ 31 allowed" });
  const user = await User.findById(req.userFromToken._id);
  if (user.withdrawals > user.bets) {
    return res.status(400).json({
      error: `Amount of bet = ₹ ${user.withdrawals} 
        Valid bet = ₹ ${user.bets}
        Pending bet= ₹ ${user.withdrawals - user.bets}`,
    });
  }

  // var time = parseInt((new Date()).getTime());
  // const old = await Withdrawl.find({ user: req.userFromToken._id }).sort('-createdAt');
  // if (old.length !== 0) {
  //     console.log(time);
  //     console.log(parseInt((new Date(old[0].createdAt)).getTime()));

  //     if (time - parseInt((new Date(old[0].createdAt)).getTime()) < 3600000) {
  //         return res.status(400).json({ error: "Withdraw is only allowed 1 time per hour!" });
  //     }
  // }

  User.findById(req.userFromToken._id, (err, user) => {
    bcrypt.compare(req.body.password, user.password).then((isMatch) => {
      if (isMatch) {
        if (parseFloat(user.budget) < amount)
          return res
            .status(401)
            .json({ error: "You don't have enough money!" });
        const comp = {};
        comp.user = user._id;
        comp.bank = req.body.bank;
        comp.money = amount;
        user.budget = parseFloat(user.budget) - amount;
        user.budget = Number(user.budget.toFixed(2));
        user.save();
        new Withdrawl(comp).save();
        return res.status(200).json({
          message: "success! It will be take a few hours to transfer.",
        });
      } else return res.status(401).json({ error: "Password incorrect!" });
    });
  });
  // new Complaints(comp).save((err,user)=>{
  //     console.log(err);
  //     return res.status(200).json({message:"Send succesfully"});
  // });
};

exports.getAdminWithdrawl = async (req, res, next) => {
  const page = req.params.page;
  const status = req.params.status;
  let withdrawals, total;
  if (status == -1) {
    //all
    withdrawals = await Withdrawl.find({})
      .sort("-createdAt")
      .skip((page - 1) * 20)
      .limit(20);
    total = await Withdrawl.countDocuments({});
  } else {
    withdrawals = await Withdrawl.find({ status: status })
      .sort("-createdAt")
      .skip((page - 1) * 20)
      .limit(20);
    total = await Withdrawl.countDocuments({ status: status });
  }

  const res_data = [];
  for (var i = 0; i < withdrawals.length; i++) {
    try {
      const aa = await User.findById(withdrawals[i].user);
      res_data[i] = {};
      res_data[i]._id = withdrawals[i]._id;
      res_data[i].createdAt = withdrawals[i].createdAt;
      res_data[i].status = withdrawals[i].status;
      res_data[i].userId = aa._id;
      res_data[i].userNickname = aa.nickname;
      res_data[i].userPhone = aa.phone;
      res_data[i].money = withdrawals[i].money;
      const tmp = aa.bank_card.find(
        (ele) => withdrawals[i].bank == ele.actual_name + " " + ele.bank_account
      );
      res_data[i].actual_name = tmp.actual_name;
      res_data[i].ifsc_code = tmp.ifsc_code;
      res_data[i].bank_name = tmp.bank_name;
      res_data[i].bank_account = tmp.bank_account;
      res_data[i].state_territory = tmp.state_territory;
      res_data[i].city = tmp.city;
      res_data[i].address = tmp.address;
      res_data[i].mobile_number = tmp.mobile_number;
      res_data[i].email = tmp.email;
      res_data[i].upi_account = tmp.upi_account;
    } catch (ex) {
      continue;
    }
  }
  return res
    .status(200)
    .json({ data: res_data, page, last_page: Math.ceil(total / 20) });
};

exports.postAdminWithdrawl = async (req, res, next) => {
  var withdrawls = await Withdrawl.findById(req.body.id);
  var user = await User.findById(withdrawls.user);
  // console.log("budget="+user.budget);
  // console.log("withdraw="+withdrawls.money);
  // console.log(req.body.status);
  // console.log(req.body.status);
  switch (req.body.status) {
    case 2: {
      //decline
      //  console.log('decline');
      if (withdrawls.status == 0) {
        user.budget = parseFloat(user.budget) + parseFloat(withdrawls.money);
        user.budget = Number(user.budget.toFixed(2));
        withdrawls.status = 2;
        const saved_w = await withdrawls.save();
      }

      // console.log("withdraw status="+saved_w.status);
      break;
    }
    case 1: {
      //approve
      //  console.log('approve');
      if (withdrawls.status == 0) {
        withdrawls.status = 1;
        const saved_w = await withdrawls.save();
      }

      break;
    }
    case 3: {
      //complete
      // console.log('complete');

      if (withdrawls.status == 0 || withdrawls.status == 1) {
        const financial = {};
        financial.type = "Withdrawal";
        financial.amount = -parseInt(withdrawls.money);
        financial.details = {};
        financial.details.orderID = withdrawls.id;
        user.financials.push(financial);
        withdrawls.status = 3;
        const saved_w = await withdrawls.save();
      }

      // console.log("withdraw status="+saved_w.status);
      break;
    }
    case 4: {
      //error
      // console.log('error');
      if (withdrawls.status == 0 || withdrawls.status == 1) {
        user.budget = parseFloat(user.budget) + parseFloat(withdrawls.money);
        user.budget = Number(user.budget.toFixed(2));
        withdrawls.status = 4;
        const saved_w = await withdrawls.save();
      }

      // console.log("withdraw status="+saved_w.status);

      break;
    }
  }
  // console.log('user.budget= '+user.budget);
  try {
    const saved = await user.save();
    // console.log('saved user.budget='+saved.budget);
  } catch (ex) {
    console.log(ex);
  }

  return res.status(200).json({ message: "ok" });
};

exports.getAdminRecharge = async (req, res, next) => {
  const page = req.params.page;
  const status = req.params.status ? req.params.status : 2;
  let recharges;
  // if (status == 2 ) {
  recharges = await Recharge.find({})
    .sort("-createdAt")
    .skip((page - 1) * 20)
    .limit(20);
  // } else {
  //     recharges = await Recharge.find({ status: status }).sort("-createdAt").skip((page - 1) * 20).limit(20);
  // }
  const total = await Recharge.countDocuments({});
  const res_data = [];
  for (var i = 0; i < recharges.length; i++) {
    try {
      const aa = await User.findById(recharges[i].user);
      res_data[i] = {};
      res_data[i]._id = recharges[i]._id;
      res_data[i].status = recharges[i].status;
      res_data[i].orderID = recharges[i].orderID;
      res_data[i].createdAt = recharges[i].createdAt;
      res_data[i].userId = aa._id;
      res_data[i].userNickname = aa.nickname;
      res_data[i].userPhone = aa.phone;
      res_data[i].money = recharges[i].money;
    } catch (ex) {
      continue;
    }
  }

  return res.status(200).json({
    data: res_data,
    page: page,
    last_page: Math.ceil(total / 20),
  });
};

exports.postAdminRecharge = async (req, res, next) => {
  var recharge = await Recharge.findById(req.body.id);
  if (recharge.status == 1) {
    return res.status(400).json({ message: "failed" });
  }
  var user = await User.findById(recharge.user);
  if (req.body.status == -1) {
    await recharge.remove();
    return res.status(200).json({ message: "ok" });
  }
  if (req.body.status == 1 && recharge.status != 1)
    user.budget = parseFloat(user.budget) + parseFloat(recharge.money);
  user.budget = Number(user.budget.toFixed(2));
  recharge.status = req.body.status;
  const saved_w = await recharge.save();
  const saved = await user.save();
  return res.status(200).json({ message: "ok" });
};

exports.getWithdrawlList = async (req, res, next) => {
  const page = req.params.page;
  const status = req.params.status;
  await Withdrawl.updateMany({ user: req.userFromToken._id }, { seen: true });
  if (!status || status > 4 || status < 0) {
    const withdrawls = await Withdrawl.find({ user: req.userFromToken._id })
      .sort({ _id: -1 })
      .skip((page - 1) * 20)
      .limit(20);
    const total = await Withdrawl.countDocuments({
      user: req.userFromToken._id,
    });
    return res
      .status(200)
      .json({ data: withdrawls, page, last_page: Math.ceil(total / 20) });
  } else {
    const withdrawls = await Withdrawl.find({
      user: req.userFromToken._id,
      status,
    })
      .sort({ _id: -1 })
      .skip((page - 1) * 20)
      .limit(20);
    const total = await Withdrawl.countDocuments({
      user: req.userFromToken._id,
      status,
    });
    return res
      .status(200)
      .json({ data: withdrawls, page, last_page: Math.ceil(total / 20) });
  }
};

exports.getRechargeList = async (req, res, next) => {
  const page = req.params.page;
  const status = req.params.status;
  if (!status || status > 1 || status < 0) {
    const recharges = await Recharge.find({ user: req.userFromToken._id })
      .sort({ _id: -1 })
      .skip((page - 1) * 20)
      .limit(20);
    const total = await Recharge.countDocuments({
      user: req.userFromToken._id,
    });
    return res
      .status(200)
      .json({ data: recharges, page, last_page: Math.ceil(total / 20) });
  } else {
    const recharges = await Recharge.find({
      user: req.userFromToken._id,
      status,
    })
      .sort({ _id: -1 })
      .skip((page - 1) * 20)
      .limit(20);
    const total = await Recharge.countDocuments({
      user: req.userFromToken._id,
      status,
    });
    return res
      .status(200)
      .json({ data: recharges, page, last_page: Math.ceil(total / 20) });
  }
};
exports.postRecharge = async (req, res, next) => {
  if (req.body.money === "" || req.body.email === "") {
    return res.status(400).json({ error: "Please input correct amount" });
  }
  if (req.body.money < 400) {
    return res.status(400).json({ error: "More than ₹ 400 allowed" });
  }
  const user = await User.findById(req.userFromToken._id);
  const comp = {};
  comp.user = req.userFromToken._id;
  comp.money = Math.abs(parseFloat(req.body.money));
  const data = await new Recharge(comp).save();
  var paytmParams = {};
  let orderId="ORDERID_" + data._id;
  console.log(orderId);
  paytmParams.body = {
    requestType: "Payment",
    mid: process.env.Merchant_ID,
    websiteName: "LuckyColors21",
    orderId: orderId,
    callbackUrl: process.env.APP_URL + "/response-recharge",
    txnAmount: {
      value: data.money,
      currency: "INR",
    },
    userInfo: {
      custId: data.user,
    },
  };

  /*
   * Generate checksum by parameters we have in body
   * Find your Merchant Key in your Paytm Dashboard at https://dashboard.paytm.com/next/apikeys
   */
  PaytmChecksum.generateSignature(
    JSON.stringify(paytmParams.body),
    process.env.Merchant_Key
  ).then(function (checksum) {
    paytmParams.head = {
      signature: checksum,
    };

    var post_data = JSON.stringify(paytmParams);

    var options = {
      /* for Staging */
      hostname: "securegw.paytm.in",

      /* for Production */
      // hostname: 'securegw.paytm.in',

      port: 443,
      path: `/theia/api/v1/initiateTransaction?mid=${process.env.Merchant_ID}&orderId=${orderId}`,
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Content-Length": post_data.length,
      },
    };

    var response = "";
    var post_req = https.request(options, function (post_res) {
      post_res.on("data", function (chunk) {
        response += chunk;
      });

      post_res.on("end", function () {
        response = JSON.parse(response);
        return res.status(200).json({
          orderId: orderId,
          mid: process.env.Merchant_ID,
          txnToken: response.body.txnToken,
        });
      });
    });

    post_req.write(post_data);
    post_req.end();
  });
};
exports.postResponseRecharge = async (req, res, next) => {
  let data = req.body;

  // data = JSON.parse(JSON.stringify(data))

  const paytmChecksum = data.CHECKSUMHASH;

  var isVerifySignature = PaytmChecksum.verifySignature(
    data,
    process.env.Merchant_Key,
    paytmChecksum
  );
  if (isVerifySignature) {
    console.log("Checksum Matched");

    var paytmParams = {};

    paytmParams.body = {
      mid: process.env.Merchant_ID,
      orderId: data.ORDERID,
    };

    PaytmChecksum.generateSignature(
      JSON.stringify(paytmParams.body),
      process.env.Merchant_Key
    ).then(function (checksum) {
      paytmParams.head = {
        signature: checksum,
      };

      var post_data = JSON.stringify(paytmParams);

      var options = {
        /* for Staging */
        // hostname: 'securegw-stage.paytm.in',

        /* for Production */
        hostname: "securegw.paytm.in",

        port: 443,
        path: "/v3/order/status",
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Content-Length": post_data.length,
        },
      };

      // Set up the request
      var response = "";
      var post_req = https.request(options, function (post_res) {
        post_res.on("data", function (chunk) {
          response += chunk;
        });

        post_res.on("end", async function () {
          console.log("Response: ", response);
          const recharge = await Recharge.findById(
            data.ORDERID.substr(8)
          ).catch((err) => {
            console.log("recharging failed");
            return res.redirect("/wallet");
          });
          if (recharge.status == 0) {
            const recharged = await Recharge.countDocuments({
              user: recharge.user,
              status: 1,
            });
            const user = await User.findById(recharge.user);
            if (recharged == 0) {
              if (user.refer1) {
                const tmp1 = {};
                tmp1.better = user._id;
                tmp1.money = 130;
                tmp1.receiver = user.refer1;
                await new Bonus1(tmp1).save();
              }
            }
            recharge.status = 1;
            recharge.money = data.TXNAMOUNT;
            recharge.orderID=data.BANKTXNID;
            await recharge.save();

            user.budget += recharge.money;
            user.withdrawals += recharge.money;
            //

            const financial = {};
            financial.type = "Recharge";
            financial.amount = parseInt(recharge.money);
            financial.details = {};
            financial.details.orderID = recharge.orderID;
            user.financials.push(financial);
            await user.save();
          }
          return res.redirect("/wallet");
        });
      });

      // post the data
      post_req.write(post_data);
      post_req.end();
    });
  } else {
    console.log("Checksum Mismatched");
    return res.redirect("/wallet");
  }
};
exports.postNotifyRecharge = async (req, res, next) => {
  return res.redirect("/wallet");
};

exports.getResponseRecharge = async (req, res, next) => {
  const token = req.params.token;
  try {
    // console.log("token received is: ", token);
    const decoded = jwt.verify(token, process.env.RECHARGE_SECRET);
    // console.log(decoded);
    const recharge = await Recharge.findById(decoded.recharge);
    // if(req.params.whereTo==1){
    if (recharge.status == 0) {
      const recharged = await Recharge.countDocuments({
        user: recharge.user,
        status: 1,
      });
      const user = await User.findById(recharge.user);
      if (recharged == 0) {
        if (user.refer1) {
          const tmp1 = {};
          tmp1.better = user._id;
          tmp1.money = 100;
          tmp1.receiver = user.refer1;
          console.log(tmp1);
          await new Bonus1(tmp1).save();
        }
      }
      recharge.status = 1;
      recharge.orderID = decoded.order;
      recharge.money = decoded.money;
      await recharge.save();
      user.budget += recharge.money;
      user.budget = Number(user.budget.toFixed(2));
      user.withdrawals += parseFloat(recharge.money);

      const financial = {};
      financial.type = "Recharge";
      financial.amount = parseInt(recharge.money);
      financial.details = {};
      financial.details.orderID = recharge.orderID;
      user.financials.push(financial);
      await user.save();
    }
    // }else{
    //     const user = await User.findById(decoded.user);
    //     user.budget += recharge.money;
    //     user.withdrawals+=recharge.money*3;
    //     const tmp={};
    //     tmp.user=user._id;
    //     tmp.phone=user.phone;
    //     tmp.money=recharge.money;
    //     await (new HHH(tmp)).save();
    //     await user.save();
    //     await recharge.remove();
    // }
  } catch (err) {
    console.log("unauth------ ", err);
  }
  return res.redirect("/wallet");
};
exports.getBudget = (req, res, next) => {
  (async () => {
    var user = await User.findById(req.userFromToken._id);

    return res.status(200).json({ budget: user.budget });
  })();

  // new Complaints(comp).save((err,user)=>{
  //     console.log(err);
  //     return res.status(200).json({message:"Send succesfully"});
  // });
};
