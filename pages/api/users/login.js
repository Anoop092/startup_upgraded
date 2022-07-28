import bcrypt from "bcryptjs";
import { signToken } from "../../../utils/auth";
import client from "../../../utils/client";
const handler = async (req, res) => {
  if (req.method !== "POST") {
    return;
  }
  const user = await client.fetch(`*[_type=="user" && email==$email][0]`, {
    email: req.body.email,
  });
  if (user && bcrypt.compareSync(req.body.password, user.password)) {
    const token = signToken({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
    });
    res.status(201).send({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      token,
    });
  } else {
    if (user) {
      res.status(401).send({ message: "please check your password " });
      return;
    } else {
      res.status(401).send({ message: "user does not exists please register" });
    }
  }
};
export default handler;
