const User = require("../models/User");
const Bonus1 = require("../models/Bonus1");
const Bonus2 = require("../models/Bonus2");
const Toss=require('../models/Toss');
exports.getToss = async (req, res, next) => {
	const user = await User.findById(req.userFromToken._id);
	return res.status(200).json({ 
		heads_count:user.heads,
		tails_count:user.tails,
		wallet: Number(user.budget.toFixed(2)) });
};
exports.postToss = async (req, res, next) => {
	try {
		const result = Math.floor(Math.random() * 2);
		const heads = Math.abs(parseInt(req.body.heads));
		const tails = Math.abs(parseInt(req.body.tails));
		const user = await User.findById(req.userFromToken._id);
		if(heads+tails>user.budget)
			return res.status(200).json({ 'error': "low budget" });
		const profit = result == 0 ? heads * 0.5 - tails : tails * 0.5 - heads;
		const toss=new Toss();
		toss.userid=user._id;
		toss.phone=user.phone;
		toss.bet=heads+tails;
		toss.profit=profit;
		await toss.save();
		user.budget += profit;
		user.budget = Number(user.budget.toFixed(2));
		user.bets += tails+heads;			
		if(result==0)
			user.heads++;
		else
			user.tails++;
		const bonus1 = parseInt(heads + tails) * 0.01;
		const bonus2 = parseInt(heads + tails) * 0.005;
		if (user.refer1) {
			const tmp1 = {};
			tmp1.better = req.userFromToken._id;
			tmp1.money = bonus1;
			tmp1.receiver = user.refer1;
			await (new Bonus1(tmp1)).save();
		}
		if (user.refer2) {
			const tmp1 = {};
			tmp1.better = req.userFromToken._id;
			tmp1.money = bonus2;
			tmp1.receiver = user.refer2;
			await (new Bonus2(tmp1)).save();
		}
		const financial = {};
		financial.type = "Toss";
		financial.amount = profit;
		financial.details = {};
		financial.details.period = Date.now();
		user.financials.push(financial);
		await user.save();
		return res.status(200).json({
			heads_count:user.heads, tails_count:user.tails, profit, result, wallet:Number(user.budget.toFixed(2))
		});
	} catch (error) {
		console.log(error)
		next(error);
	}

};




exports.getTossAdmin = async (req, res, next) => {
	var d = new Date();
	var cur_time = d.getTime();
	const heads = bet[0].length > 0 ? bet[0].reduce((accumulator, currentValue) => accumulator + currentValue[1], 0) : 0;
	const tails = bet[1].length > 0 ? bet[1].reduce((accumulator, currentValue) => accumulator + currentValue[1], 0) : 0;
	return res.status(200).json({ auto, result, heads: heads > 0 ? heads.toFixed(2) : 0, tails: tails > 0 ? tails.toFixed(2) : 0, status, time: cur_time - start_time });

};
exports.postAdminToss = (req, res, next) => {
	try {
		if (status == 0) {
			result = req.body.select;
			var d = new Date();
			var cur_time = d.getTime();
			const heads = bet[0].length > 0 ? bet[0].reduce((accumulator, currentValue) => accumulator + currentValue[1], 0) : 0;
			const tails = bet[1].length > 0 ? bet[1].reduce((accumulator, currentValue) => accumulator + currentValue[1], 0) : 0;
			return res.status(200).json({ auto, result, heads: heads > 0 ? heads.toFixed(2) : 0, tails: tails > 0 ? tails.toFixed(2) : 0, status, time: cur_time - start_time });


		} else {
			return res.status(200).json({ 'error': 'Already finished!' });
		}
	} catch (error) {
		next(error);
	}




};
exports.postAdminTossAuto = (req, res, next) => {
	auto = req.body.auto;
	// console.log(auto);
	res.status(200).json({ message: "ok" });
};