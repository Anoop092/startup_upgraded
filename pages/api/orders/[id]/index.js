import requestValidator from "../../../../middelware/requestValidator";
import client from "../../../../utils/client";
import { getError } from "../../../../utils/error";

const handler = async (req, res) => {
  if (req.method !== "GET") {
    return res.status(400).send({ message: "only get request are allowed" });
  }
  try {
    const order = await client.fetch(`*[_type=="order" && _id == $id][0]`, {
      id: req.query.id,
    });
    res.status(200).send(order);
  } catch (error) {
    res.status(400).send({ message: getError(error) });
  }
};
export default requestValidator(handler);
