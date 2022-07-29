import client from "../../../utils/client";
const handler = async (req, res) => {
  const products = await client.fetch(`*[_type=="product" && _id == $id]`, {
    id: req.query.id,
  });
  const product = products.find((x) => x._id === req.query.id);

  res.status(200).send(product);
};

export default handler;
