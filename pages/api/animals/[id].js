import client from "../../../utils/client";
const handler = async (req, res) => {
  const animals = await client.fetch(`*[_type=="animal" && _id == $id]`, {
    id: req.query.id,
  });
  const animal = animals.find((x) => x._id === req.query.id);

  res.status(200).send(animal);
};

export default handler;
