const Nexmo = require("nexmo");

const nexmo = new Nexmo({
  apiKey: process.env.NEXMO_API_KEY,
  apiSecret: process.env.NEXMO_API_SECRET,
});

const sendOTP = (number, callback) => {
  nexmo.verify.request(
    {
      number,
      brand: "Pixs",
      code_length: "6",
    },
    (err, result) => {
      callback(err ? err : result);
    }
  );

  // callback({ request_id: "jsdflkj334" });
};

module.exports = sendOTP;
