import requestValidator from "../../../middelware/requestValidator";
import client from "../../../utils/client";

const handler = async (req, res) => {
  if (req.method !== "GET") {
    res.status(400).send({ message: "only get request are allowed" });
    return;
  }
  const orders = await client.fetch(`*[_type=="order" && user._ref==$userId]`, {
    userId: req.user._id,
  });

  res.send(orders);
};
export default requestValidator(handler);
