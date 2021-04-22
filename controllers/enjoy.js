const User = require("../models/User");
const Enjoy = require("../models/Enjoy");
const Bonus1 = require("../models/Bonus1");
const Bonus2 = require("../models/Bonus2");
const MyEnjoy = require("../models/MyEnjoy");
var status = 0;
var d = new Date();
var old_d;
var start_time = d.getTime();
//betters info
//first is level -Lucy,..
//second is better list
//
//0 -> user.id
//1 -> budget
//2 -> array, 0~12 betting amount on  colors and numbers
//3 -> array, 0~12 prize amount on colors and numbers
//4 -> total betting amount
//5 -> total prize amount
var bet = [];
//better count
var bet_no = [];
//result
var result = [];
var all_log = [];
//total budget
var budget;
//total price
var no = 1;
var log_time;
const rooms=4;
var auto = false;
for (var i = 0; i < rooms; i++) {
	bet[i] = [];
	bet_no[i] = 0;
	Enjoy.find({ level: i }).sort({ _id: -1 })
		.limit(10)
		.then(reviews => {
			all_log[i] = reviews;
		});
}



var completing = async () => {
	setTimeout(betting, 30000);
	status = 1;
	no++;
	for (var k = 0; k < rooms; k++) {
		if (auto == true) {
			// console.log('sdfsdfsdfsssssssss');
			var number_amounts = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
			var budget_predict = 0;
			var top_budget_num, top_budget;
			for (var i = 0; i < bet_no[k]; i++) {
				for (var l = 0; l < 13; l++) {
					number_amounts[l] += parseInt(bet[k][i][2][l]);

				}

			}
			var tmp_budget, tmp_price, top_profits_arr = [];
			for (i = 0; i < 10; i++) {
				if (i % 5 === 0) {
					tmp_price = Math.floor(number_amounts[i] * 7.82 + number_amounts[12] * 3.41 + number_amounts[11 - (i % 2)] * 0.47);
					tmp_budget = 0;
					for (var l = 0; l < 13; l++)
						tmp_budget += number_amounts[l];
					tmp_budget = Math.floor(tmp_budget - tmp_price - number_amounts[i] - number_amounts[12] - number_amounts[11 - (i % 2)]);
				} else if (i % 2 === 0) {
					tmp_price = Math.floor(number_amounts[i] * 7.82 + number_amounts[11] * 0.96);
					tmp_budget = 0;
					for (l = 0; l < 13; l++)
						tmp_budget += number_amounts[l];
					tmp_budget = Math.floor(tmp_budget - tmp_price - number_amounts[i] - number_amounts[11]);
				} else {
					tmp_price = Math.floor(number_amounts[i] * 7.82 + number_amounts[10] * 0.96);
					tmp_budget = 0;
					for (l = 0; l < 13; l++)
						tmp_budget += number_amounts[l];
					tmp_budget = tmp_budget - tmp_price - number_amounts[i] - number_amounts[10];
				}

				if (top_budget === undefined) {
					top_budget = tmp_budget;
					top_budget_num = i;
					top_profits_arr.push(i);
				} else {
					if (top_budget < tmp_budget) {
						top_budget = tmp_budget;
						top_budget_num = i;
						top_profits_arr = [];
						top_profits_arr.push(i);
					} else if (top_budget == tmp_budget) {
						top_profits_arr.push(i);
					}
				}


			}

			if (top_profits_arr.length > 1) {
				let index = Math.round(top_profits_arr.length * Math.random());
				index = (index == top_profits_arr.length) ? 0 : index;
				result[k] = top_profits_arr[index];
			} else
				result[k] = top_budget_num;
		}
		result[k] = result[k] ? result[k] : 0;
		//each rooms -Lucy, sapre, ...
		budget = 0;
		for (var i = 0; i < bet_no[k]; i++) {
			//each betters...
			bet[k][i][3] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
			//total contract
			bet[k][i][4] = 0;
			//total price
			bet[k][i][5] = 0;
			for (var color = 0; color < 13; color++) {
				if (bet[k][i][2][color] == 0)
					continue;
				switch (color) {
					case 10:
						{
							// console.log("sdfsdf");
							if ([1, 3, 7, 9].find(ele => ele == result[k])) {
								bet[k][i][3][color] = parseInt(bet[k][i][2][color] * 0.98 * 2);
							} else if (result[k] == 5) {
								bet[k][i][3][color] = parseInt(bet[k][i][2][color] * 0.98 * 1.5);
							}
							// console.log(bet[i]);
							break;
						}
					case 11:
						{
							if ([2, 4, 6, 8].find(ele => ele == result[k])) {
								bet[k][i][3][color] = parseInt(bet[k][i][2][color] * 0.98 * 2);
							} else if (result[k] == 0) {
								bet[k][i][3][color] = parseInt(bet[k][i][2][color] * 0.98 * 1.5);
							}
							break;
						}
					case 12:
						{
							// console.log(result[k]);
							if (result[k] == 0 || [0, 5].find(ele => ele == result[k])) {
								// console.log('hi');
								bet[k][i][3][color] = parseInt(bet[k][i][2][color] * 0.98 * 4.5);
							}
							break;
						}
					default: {
						if (result[k] == color)
							bet[k][i][3][color] = parseInt(bet[k][i][2][color] * 0.98 * 9);
						break;
					}

				}
				bet[k][i][4] += bet[k][i][2][color];
				bet[k][i][5] += bet[k][i][3][color];
				//MyEnjoy add
				////////////////////////////////
				const myEnjoy = {};
				myEnjoy.period = log_time;
				myEnjoy.contract = bet[k][i][2][color];
				myEnjoy.select = color;
				myEnjoy.result = result[k] ? result[k] : 0;
				if (!result[k]) {
					console.log("result error!!!!!!!!!!!!");
					console.log(result);
					console.log(result.length);
					console.log(k);
				}
				myEnjoy.amount = bet[k][i][3][color] - bet[k][i][2][color];
				myEnjoy.user = bet[k][i][0];
				myEnjoy.category = k;

				await (new MyEnjoy(myEnjoy)).save();
				const user = await User.findById(bet[k][i][0]);
				const financial = {};
				financial.type = "Betting";
				financial.amount = bet[k][i][3][color] - bet[k][i][2][color];
				financial.details = {};
				financial.details.period = log_time;
				user.financials.push(financial);
				await user.save();
				//player budget
				/////////////////////////////////////
				//here [0][i][1] added all the betting ...

				bet[0][i][1] += bet[k][i][3][color];
				//Enjoy log 
				////////////////////////////////
				budget = budget - bet[k][i][3][color] + bet[k][i][2][color];
			}
		}
		// Enjoy add
		////////////////////////
		const enjoy = {};
		let betters = 0;
		let bettersArray = [];
		for (let i = 0; i < bet_no[k]; i++) {
			if (bet[k][i][4] == 0)
				continue;
			betters++;
			bettersArray.push(bet[k][i]);
		}
		try {
			if (betters == 0) {
				// console.log("bet 0");
				enjoy.joiner = Math.floor(Math.random() * 15);
				if (enjoy.joiner > 1) {
					// console.log("more than 1");
					enjoy.winner = (1000 + Math.floor(Math.random() * 8999)) + "****" + (10 + Math.floor(Math.random() * 89));
					enjoy.loser = (1000 + Math.floor(Math.random() * 8999)) + "****" + (10 + Math.floor(Math.random() * 89));
					enjoy.winner_amount = (10 + Math.floor(Math.random() * 10) * 10) * 0.98 * 9;
					enjoy.loser_amount = -(10 + Math.floor(Math.random() * 10) * 10);
				} else if (enjoy.joiner == 1) {
					if (Math.floor(Math.random() * 2) == 1) {
						// console.log("winner");
						enjoy.winner = (1000 + Math.floor(Math.random() * 8999)) + "****" + (10 + Math.floor(Math.random() * 89));
						enjoy.loser = "";
						enjoy.winner_amount = (10 + Math.floor(Math.random() * 10) * 10) * 0.98 * 9;
						enjoy.loser_amount = 0;
					} else {
						// console.log("loser");
						enjoy.winner = "";
						enjoy.loser = (1000 + Math.floor(Math.random() * 8999)) + "****" + (10 + Math.floor(Math.random() * 89));
						enjoy.winner_amount = 0;
						enjoy.loser_amount = -(10 + Math.floor(Math.random() * 10) * 10);
					}
				} else {
					// console.log("0");
					enjoy.winner = "";
					enjoy.loser = "";
					enjoy.winner_amount = 0;
					enjoy.loser_amount = 0;
				}
			} else if (betters == 1) {
				// console.log("bet 1");
				enjoy.joiner = 1 + Math.floor(Math.random() * 10) + betters;
				const user = await User.findById(bettersArray[0][0]);
				const tmp_amount = bettersArray[0][5] - bettersArray[0][4];
				if (tmp_amount > 0 && tmp_amount != 0) {
					enjoy.winner = ("" + user.phone).substr(0, 4) + "****" + ("" + user.phone).substr(8, 2);
					enjoy.loser = (1000 + Math.floor(Math.random() * 8999)) + "****" + (10 + Math.floor(Math.random() * 89));
					enjoy.winner_amount = tmp_amount;
					enjoy.loser_amount = -(10 + Math.floor(Math.random() * 10) * 10);
				} else {
					enjoy.loser = ("" + user.phone).substr(0, 4) + "****" + ("" + user.phone).substr(8, 2);
					enjoy.winner = (1000 + Math.floor(Math.random() * 8999)) + "****" + (10 + Math.floor(Math.random() * 89));
					enjoy.loser_amount = tmp_amount;
					enjoy.winner_amount = (10 + Math.floor(Math.random() * 10) * 10) * 0.98 * 9;
				}
			}
			else {
				// console.log("bet more than 2");
				enjoy.joiner = Math.floor(Math.random() * 11) + betters;
				let user = await User.findById(bettersArray[0][0]);
				let max_user = ("" + user.phone).substr(0, 4) + "****" + ("" + user.phone).substr(8, 2);
				let max = bettersArray[0][5] - bettersArray[0][4];
				let min_user = ("" + user.phone).substr(0, 4) + "****" + ("" + user.phone).substr(8, 2);
				let min = bettersArray[0][5] - bettersArray[0][4];
				for (let i = 1; i < betters; i++) {
					if (max < bettersArray[i][5] - bettersArray[i][4]) {
						max = bettersArray[i][5] - bettersArray[i][4];
						user = await User.findById(bettersArray[i][0]);
						max_user = ("" + user.phone).substr(0, 4) + "****" + ("" + user.phone).substr(8, 2);
					}
					if (min < bettersArray[i][5] - bettersArray[i][4]) {
						min = bettersArray[i][5] - bettersArray[i][4];
						user = await User.findById(bettersArray[i][0]);
						min_user = ("" + user.phone).substr(0, 4) + "****" + ("" + user.phone).substr(8, 2);
					}
				}
				enjoy.winner = max_user;
				enjoy.loser = min_user;
				enjoy.winner_amount = max;
				enjoy.loser_amount = min;
			}
		} catch (err) {
			console.log(err);
		}

		enjoy.budget = parseFloat(budget.toFixed(2));
		if (!result[k]) {
			console.log('result error in enjoy');
			console.log(result);
			console.log(result.length);
			console.log(k);
			enjoy.recommend = 0;
		} else
			enjoy.recommend = result[k];

		// enjoy.price = (enjoy.winner_amount + enjoy.loser_amount * 2) * enjoy.joiner / 2;
		enjoy.price=Math.round(Math.random()*1000)*10+result[k];
		// enjoy.price = 01000;
		enjoy.level = k;
		enjoy.createdAt = log_time;
		// console.log('hey! here only once - ' +enjoy.createdAt + " created");
		// console.log(enjoy);
		await (new Enjoy(enjoy)).save();
		// console.log('hey! here only once - ' +enjoy.createdAt + " done");
	}

};
var betting = async () => {
	for (let ppp = 0; ppp < bet[0].length; ppp++) {
		const doc = await User.findById(bet[0][ppp][0]);
		// console.log(parseFloat(doc.budget)+" "+bet[2][ppp][1]+" "+ bet[0][ppp][1]);
		if (doc) {
			// if (!bet[2][ppp][1]) {
			// 	console.log("error !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!");
			// 	console.log(doc);
			// 	console.log(bet[2][ppp]);
			// 	console.log(bet[0][ppp])
			// }
			let betAmount=0;
			let priceAmount=0;
			for(let i=0;i<rooms;i++){
				betAmount+=bet[i][ppp][4] ? parseFloat(bet[i][ppp][4]) : 0;
				priceAmount+=bet[i][ppp][5] ? parseFloat(bet[i][ppp][5]) : 0;
			}
			const ttt=priceAmount-betAmount
			doc.prices += ttt;
			doc.budget += Number(priceAmount.toFixed(2));
			await doc.save();
		}
	}
	setTimeout(completing, 150000);

	d = new Date();
	d = d.getFullYear() + "" + (1 + parseInt(d.getMonth())) + d.getUTCDate();
	if (old_d && old_d !== d) {
		no = 1;
	}
	old_d = d;
	if (log_time === undefined) {
		const docs = await Enjoy.find({ createdAt: { '$regex': d + ".*" } }).sort({ createdAt: -1 });
		// console.log(err);
		// console.log(docs);
		if (docs.length == 0) {
			log_time = d + "000" + 1;
			no = 1;
		}
		else {
			const tmp_no = parseInt(docs[0].createdAt.substring(d.length));
			if (tmp_no < 9)
				log_time = d + "000" + (tmp_no + 1);
			else if (tmp_no < 99)
				log_time = d + "00" + (tmp_no + 1);
			else if (tmp_no < 999)
				log_time = d + "0" + (tmp_no + 1);
			else if (tmp_no < 9999)
				log_time = d + "" + (tmp_no + 1);
			no = tmp_no + 1;
		}
		for (var i = 0; i < rooms; i++) {
			status = 0;
			bet_no[i] = 0;
			d = new Date();
			start_time = d.getTime();
			bet[i] = [];
			result[i] = Math.round(Math.random() * 10);
			if (result[i] == 10) {
				result[i] = 0;
			}
		}

	} else {
		if (no < 10)
			log_time = d + "000" + (no);
		else if (no < 100)
			log_time = d + "00" + (no);
		else if (no < 1000)
			log_time = d + "0" + (no);
		else if (no < 10000)
			log_time = d + "" + (no);


		for (var i = 0; i < rooms; i++) {
			status = 0;
			bet_no[i] = 0;
			d = new Date();
			start_time = d.getTime();
			bet[i] = [];
			result[i] = Math.round(Math.random() * 10);
			if (result[i] == 10) {
				result[i] = 0;
			}
		}
	}




};
betting();



exports.getEnjoy = async (req, res, next) => {
	//getInfo
	const user=await User.findById(req.userFromToken._id);
	try {
		var d = new Date();
		var cur_time = d.getTime();
		const level = parseInt(req.params.level);
		if (bet[level].length == 0) {
			for (var i = 0; i < rooms; i++) {
				bet[i][bet_no[i]] = [];
				bet[i][bet_no[i]][0] = req.userFromToken._id;
			}
			const user = await User.findById(req.userFromToken._id);
			if (user) {
				for (var i = 0; i < rooms; i++) {
					bet[i][bet_no[i]][1] = Number(user.budget.toFixed(2));
					bet[i][bet_no[i]][2] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
					//each betters...
					bet[i][bet_no[i]][3] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
					//total contract
					bet[i][bet_no[i]][4] = 0;
					bet_no[i]++;
				}
				//console.log("budget="+user);

				// console.log(bet[0][1]+bet[0][0]);
				// console.log(bet_no);
				// console.log(bet[bet_no-1]);
				let reviews;
				if(cur_time - start_time>178000 || cur_time - start_time<150000){
					reviews= await Enjoy.find({ level: level }).sort({ _id: -1 }).limit(10);
				}else{
					reviews= await Enjoy.find({ level: level }).sort({ _id: -1 }).skip(1).limit(10);
				}
				all_log[level] = reviews;
				const myReview = await MyEnjoy.find({ '$and': [{ category: level }, { user: bet[level][bet_no[level] - 1][0] }] }).sort({ _id: -1 }).limit(10);
				const enjoy_count = await Enjoy.countDocuments({ level: level });
				const my_enjoy_count = await MyEnjoy.countDocuments({ '$and': [{ category: level }, { user: bet[level][bet_no[level] - 1][0] }] });
				var tmp_bet = [];
				tmp_bet[0] = bet[0][bet_no[level] - 1][1];
				tmp_bet[1] = bet[0][bet_no[level] - 1][2];
				return res.status(200).json({
					log_time: log_time, time: cur_time - start_time,
					records: all_log[level], 'bet': tmp_bet, my_records: myReview,
					records_page: 1,
					last_records_page: Math.ceil(enjoy_count / 10),
					records_my_page: 1,
					last_records_my_page: Math.ceil(my_enjoy_count / 10),
				});
			}

		} else if (bet[level].find(ele => ele[0] == req.userFromToken._id) === undefined) {
			for (var i = 0; i < rooms; i++) {
				bet[i][bet_no[i]] = [];
				bet[i][bet_no[i]][0] = req.userFromToken._id;
			}
			// console.log('prior bet'+bet);

			const user = await User.findById(req.userFromToken._id);
			for (var i = 0; i < rooms; i++) {
				// console.log('after bet[i][bet_no[i]]'+bet[i][bet_no[i]]);
				bet[i][bet_no[i]][1] = Number(user.budget.toFixed(2));
				bet[i][bet_no[i]][2] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
				//each betters...
				bet[i][bet_no[i]][3] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
				//total contract
				bet[i][bet_no[i]][4] = 0;
				bet_no[i]++;
			}
			//console.log("budget="+user);

			// console.log(bet[0][1]+bet[0][0]);
			// console.log(bet_no);
			// console.log(bet[bet_no-1]);
			let reviews;
			if(cur_time - start_time>178000 || cur_time - start_time<150000){
				reviews= await Enjoy.find({ level: level }).sort({ _id: -1 }).limit(10);
			}else{
				reviews= await Enjoy.find({ level: level }).sort({ _id: -1 }).skip(1).limit(10);
			}
			all_log[level] = reviews;
			const myReview = await MyEnjoy.find({ '$and': [{ category: level }, { user: req.userFromToken._id }] }).sort({ _id: -1 }).limit(10);
			// console.log(myReview);
			const enjoy_count = await Enjoy.countDocuments({ level: level });
			const my_enjoy_count = await MyEnjoy.countDocuments({ '$and': [{ category: level }, { user: req.userFromToken._id }] });
			// console.log(myReview);
			var tmp_bet = [];
			tmp_bet[0] = bet[0][bet_no[level] - 1][1];
			tmp_bet[1] = bet[0][bet_no[level] - 1][2];

			return res.status(200).json({
				log_time: log_time, time: cur_time - start_time,
				records: all_log[level], 'bet': tmp_bet, my_records: myReview,
				records_page: 1,
				last_records_page: Math.ceil(enjoy_count / 10),
				records_my_page: 1,
				last_records_my_page: Math.ceil(my_enjoy_count / 10),
			});

		} else {
			if (status == 0) {
				//bettting
				// console.log('0');
				var _bet = bet[level].find(ele => ele[0] == req.userFromToken._id);
				var _bet_id = bet[level].findIndex(ele => ele[0] == req.userFromToken._id);
				// console.log(bet_no);
				// console.log(bet[bet_no-1]);
				let reviews;
				if(cur_time - start_time>178000 || cur_time - start_time<150000){
					reviews= await Enjoy.find({ level: level }).sort({ _id: -1 }).limit(10);
				}else{
					reviews= await Enjoy.find({ level: level }).sort({ _id: -1 }).skip(1).limit(10);
				}
				all_log[level] = reviews;
				const myReview = await MyEnjoy.find({ '$and': [{ category: level }, { user: req.userFromToken._id }] }).sort({ _id: -1 }).limit(10);
				const enjoy_count = await Enjoy.countDocuments({ level: level });
				const my_enjoy_count = await MyEnjoy.countDocuments({ '$and': [{ category: level }, { user: req.userFromToken._id }] });
				// console.log(myReview);
				var tmp_bet = [];
				tmp_bet[0] = bet[0][_bet_id][1];
				tmp_bet[1] = bet[level][_bet_id][2];
				return res.status(200).json({
					log_time: log_time, time: cur_time - start_time,
					records: all_log[level], 'bet': tmp_bet, my_records: myReview,
					records_page: 1,
					last_records_page: Math.ceil(enjoy_count / 10),
					records_my_page: 1,
					last_records_my_page: Math.ceil(my_enjoy_count / 10),
					balance:user.budget
				});
			} else {
				var _bet = bet[level].find(ele => ele[0] == req.userFromToken._id);
				var _bet_id = bet[level].findIndex(ele => ele[0] == req.userFromToken._id);
				let reviews;
				if(cur_time - start_time>178000 || cur_time - start_time<150000){
					reviews= await Enjoy.find({ level: level }).sort({ _id: -1 }).limit(10);
				}else{
					reviews= await Enjoy.find({ level: level }).sort({ _id: -1 }).skip(1).limit(10);
				}
				
				all_log[level] = reviews;
				const myReview = await MyEnjoy.find({ '$and': [{ category: level }, { user: _bet[0] }] }).sort({ _id: -1 }).limit(10);
				var tmp_contract = [0, 0, 0, 0];
				var tmp_price = [0, 0, 0, 0];
				for (var i = 0; i < rooms; i++) {
					tmp_contract[i] = bet[i][_bet_id][4];
					tmp_price[i] = bet[i][_bet_id][5];
				}
				const enjoy_count = await Enjoy.countDocuments({ level: level });
				const my_enjoy_count = await MyEnjoy.countDocuments({ '$and': [{ category: level }, { user: _bet[0] }] });
				var tmp_bet = [];
				// console.log('_bet_id='+_bet_id);
				// console.log(bet[level][_bet_id]);
				tmp_bet[0] = bet[0][_bet_id][1];
				tmp_bet[1] = bet[level][_bet_id][2];
				if(cur_time - start_time>178000){
					return res.status(200).json({
						number: result, price: tmp_price, contract: tmp_contract, log_time: log_time, time: cur_time - start_time,
						records: all_log[level], 'bet': tmp_bet, my_records: myReview,
						records_page: 1,
						last_records_page: Math.ceil(enjoy_count / 10),
						records_my_page: 1,
						last_records_my_page: Math.ceil(my_enjoy_count / 10),
						balance:user.budget
					});
				}else{
					return res.status(200).json({
						price: tmp_price, contract: tmp_contract, log_time: log_time, time: cur_time - start_time,
						records: all_log[level], 'bet': tmp_bet, my_records: myReview,
						records_page: 1,
						last_records_page: Math.ceil(enjoy_count / 10),
						records_my_page: 1,
						last_records_my_page: Math.ceil(my_enjoy_count / 10),
					});
				}
				
			}
		}
	} catch (error) {
		next(error);
	}


};
exports.postEnjoy = async (req, res, next) => {
	try {
		var d = new Date();
		var cur_time = d.getTime();
		const level = req.body.level;
		if (status == 0) {
			const user=await User.findById(req.userFromToken._id);
			var _bet = bet[level].find(ele => ele[0] == req.userFromToken._id);
			var _bet_id = bet[level].findIndex(ele => ele[0] == req.userFromToken._id);
			// console.log(bet_no);
			// console.log(bet[bet_no-1]);
			if (!_bet)
				return res.status(200).json({ 'error': "unknown user" });
			const input_contract = Math.abs(parseInt(req.body.contract_money));
			// _bet[2][parseInt(req.body.guess)]=
			if (input_contract < 10) {
				return res.status(200).json({ 'error': "more than ₹ 9" });
			}
			else if (user.budget - input_contract < 0) {
				return res.status(200).json({ 'error': "Not enough Balance" });
			}
			else {
				if (req.body.guess == 10) {
					if (_bet[2][11] > 0) {
						return res.status(200).json({ 'error': "You are not allowed to bet on Both side in a Single Period." });
					}
				}
				if (req.body.guess == 11) {
					if (_bet[2][10] > 0) {
						return res.status(200).json({ 'error': "You are not allowed to bet on Both side in a Single Period." });
					}
				}
				user.budget=user.budget- input_contract;
				user.budget = Number(user.budget.toFixed(2));
				bet[0][_bet_id][1]=user.budget;
				_bet[2][parseInt(req.body.guess)] += input_contract;
			}
			var tmp = [];
			// const bonus1 = parseInt(input_contract) >= 1000 ? parseInt(input_contract) * 0.003 : parseInt(input_contract) * 0.006;
			// const bonus2 = parseInt(input_contract) >= 1000 ? parseInt(input_contract) * 0.0015 : parseInt(input_contract) * 0.003;
			const bonus1 = parseInt(input_contract) * 0.002;
			const bonus2 = parseInt(input_contract) * 0.001;
			user.bets += parseInt(input_contract);
			await user.save();
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
			tmp[0] = user.budget;
			tmp[1] = bet[level][_bet_id][2];
			return res.status(200).json({ 'bet': tmp });

		} else {
			return res.status(200).json({ 'error': "finished", time: cur_time - start_time });
		}
	} catch (error) {
		next(error);
	}

};
exports.getEnjoyPage = async (req, res, next) => {
	try {
		var d = new Date();
		var cur_time = d.getTime();
		const level = req.params.level;
		const page = req.params.page;
		let reviews, enjoy_count;
		if(cur_time - start_time>178000 || cur_time - start_time<150000){
			reviews = await Enjoy.find({ level: level }).sort({ _id: -1 }).skip((page - 1) * 10).limit(10);
			enjoy_count = await Enjoy.countDocuments({ level: level });
		}else{
			reviews = await Enjoy.find({ level: level }).sort({ _id: -1 }).skip((page - 1) * 10+1).limit(10);
			enjoy_count = (await Enjoy.countDocuments({ level: level })) - 1;
		}
		return res.status(200).json({
			records: reviews,
			records_page: page,
			last_records_page: Math.ceil(enjoy_count / 10)
		});
	} catch (error) {
		next(error);
	}
};
exports.getEnjoyMyPage = async (req, res, next) => {
	try {
		var d = new Date();
		var cur_time = d.getTime();
		const level = req.params.level;
		const page = req.params.page;
		let reviews, enjoy_count;
		if(cur_time - start_time>178000 || cur_time - start_time<150000){
			reviews = await MyEnjoy.find({ '$and': [{ category: level }, { user: req.userFromToken._id }] }).sort({ _id: -1 }).skip((page - 1) * 10).limit(10);
			enjoy_count = await MyEnjoy.countDocuments({ '$and': [{ category: level }, { user: req.userFromToken._id }] });
		}else{
			reviews = await MyEnjoy.find({ '$and': [{ category: level }, { user: req.userFromToken._id }] }).sort({ _id: -1 }).skip(1+(page - 1) * 10).limit(10);
			enjoy_count = (await MyEnjoy.countDocuments({ '$and': [{ category: level }, { user: req.userFromToken._id }] }))-1;
		}
		return res.status(200).json({
			my_records: reviews,
			records_my_page: page,
			last_records_my_page: Math.ceil(enjoy_count / 10)
		});
	} catch (error) {
		next(error);
	}
};

exports.getEnjoyAdmin = async (req, res, next) => {
	const tmp_bets = JSON.parse(JSON.stringify(bet));
	for (let i = 0; i < rooms; i++) {
		for (let k = 0; k < tmp_bets[i].length; k++) {
			tmp_bets[i][k][0] = (await User.findById(tmp_bets[i][k][0])).phone;
		}
	}
	try {
		if (req.params.level == 4) {
			var d = new Date();
			var cur_time = d.getTime();
			res.status(200).json({
				log_time: log_time,
				time: cur_time - start_time,
				bet: tmp_bets,
				auto: auto,
				'number': result
			});
		} else {
			const level = req.params.level;
			var d = new Date();
			var cur_time = d.getTime();
			res.status(200).json({
				log_time: log_time,
				time: cur_time - start_time,
				bet: tmp_bets[level],
				auto: auto,
				'number': result[level]
			});
		}
	} catch (error) {
		next(error);
	}
};
exports.postEnjoyAdmin = (req, res, next) => {
	try {
		const level = req.body.level;
		if (status == 0) {
			//bettting
			// console.log('0');

			// console.log(bet_no);
			// console.log(bet[bet_no-1]);
			if (req.body.number >= 0 && req.body.number < 10) {
				result[level] = req.body.number;
				return res.status(200).json({ 'message': 'ok' });
			} else {
				return res.status(200).json({ 'error': 'Numbers Range 0 ~ 9' });
			}
		} else {
			// console.log("number="+number);
			return res.status(200).json({ 'error': 'Already finished!' });
		}
	} catch (error) {
		next(error);
	}
};
exports.postEnjoyAdminAuto = (req, res, next) => {
	auto = req.body.auto;
	// console.log(auto);
	res.status(200).json({ message: "ok" });
};