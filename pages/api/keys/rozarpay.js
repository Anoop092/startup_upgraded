const RazorPay = require("razorpay");
const shortid = require("shortid");

const handler = async (req, res) => {
  if (req.method !== "POST") {
    return;
  }
  const razorpay = new RazorPay({
    key_id: process.env.KEY_ID,
    key_secret: process.env.KEY_SECRET,
  });
  const options = {
    amount: req.body.amount * 100,
    currency: "INR",
    receipt: shortid.generate(),
  };
  try {
    const response = await razorpay.orders.create(options);
    res.status(200).send({
      id: response.id,
      currency: response.currency,
      amount: response.amount,
    });
  } catch (err) {
    console.log(err);
    res.status(400).json(err);
  }
};
export default handler;
