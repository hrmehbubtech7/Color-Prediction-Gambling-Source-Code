const User = require("../models/User");
const Envelope = require("../models/Envelope");

exports.listEnvelopes = async (req, res, next) => {
    console.log("list envelope")
    try {
        const page = req.params.page;
        const envelopes = await Envelope.find({}).populate('createdBy').populate('awarding').sort({ _id: -1 })
            .skip((page - 1) * 10)
            .limit(10);
        const envelope_count = await Envelope.countDocuments({});
        console.log(envelopes);
        console.log(envelope_count);
        return res.status(200).json({
            envelopes: envelopes,
            page: page,
            last_page: Math.ceil(envelope_count / 10)
        });

    } catch (err) {
        console.log(err)
        return res.status(200).json({
            envelopes: [],
            page: 1,
            last_page: 0
        });
    }

};
exports.createEnvelope = (req, res, next) => {
    if (req.body.amount != "" && req.body.count != "") {
        const comp = {};
        comp.amount = req.body.amount;
        comp.count = req.body.count;
        comp.createdBy = req.userFromToken._id;
        var envelope = new Envelope(comp).save((err, data) => {

            res.status(200).json({ message: 'ok' });
        });
    } else
        res.status(200).json({ message: 'ok' });

};
exports.getEnvelope = async (req, res, next) => {
    try {
        var envelope = await Envelope.findById(req.params.id);
        const findIndex = envelope.awarding.findIndex(ele => ele == req.userFromToken._id);
        if (envelope && !envelope.status && envelope.awarding.length < envelope.count && findIndex < 0) {
            envelope.awarding.push(req.userFromToken._id);
            if (envelope.awarding.length == envelope.count)
                envelope.status == true;
            await envelope.save();
            var user = await User.findById(req.userFromToken._id);
            user.budget = parseFloat(user.budget) + parseFloat(envelope.amount);
            user.budget = Number(user.budget.toFixed(2));
            const financial = {};
            financial.type = "Envelope";
            financial.amount = parseInt(envelope.amount);
            financial.details = {};
            financial.details.orderID = envelope.id;
            user.withdrawals += parseInt(envelope.amount)*3;
            user.financials.push(financial);
            const saved_user = await user.save();
            return res.status(200).json({ message: envelope.amount });
        }
        res.status(400).json({ message: 'already enveloped' });
    } catch (err) {
        console.log(err)
        res.status(400).json({ message: 'error' });
    }

};
exports.deleteEnvelope = async (req, res, next) => {
    try {
        var envelope = await Envelope.findById(req.params.id);

        await envelope.delete();
        return res.status(200).json({ message: 'ok' });
        res.status(400).json({ error: 'fail' });
    } catch (err) {
        res.status(400).json({ error: 'fail' });
    }

};
exports.getEnvelopeExisted = async (req, res, next) => {
    try {
        var envelope = await Envelope.findById(req.params.id).populate('awarding');
        const findIndex = envelope.awarding.findIndex(ele => {
            return ele._id == req.userFromToken._id;
        });
        if (envelope && !envelope.status && envelope.awarding.length < envelope.count && findIndex < 0) {

            return res.status(200).json({ envelope });
        }
        res.status(400).json({ message: 'already enveloped' });
    } catch (err) {
        console.log(err);
        res.status(400).json({ message: 'error' });
    }

};