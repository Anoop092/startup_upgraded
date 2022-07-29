const handler = (req, res) => {
  if (req.method !== "GET") {
    return;
  }
  const catagories = ["cat", "dog"];
  res.send(catagories);
};
export default handler;
