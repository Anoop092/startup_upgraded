import bcrypt from "bcryptjs";
import axios from "axios";
import config from "../../../utils/config";
import { signToken } from "../../../utils/auth";
import client from "../../../utils/client";

const handler = async (req, res) => {
  if (req.method !== "POST") {
    return;
  }
  const projectId = config.projectId;
  const dataset = config.dataset;
  // for updating and writing in sanity we need to create token
  const tokenWithWriteAccess = process.env.SANITY_AUTH_TOKEN;
  // writing a query for adding a user in sanity
  const createMutations = [
    {
      create: {
        _type: "user",
        name: req.body.name,
        email: req.body.email,
        password: bcrypt.hashSync(req.body.password),
        isAdmin: false,
      },
    },
  ];
  const userExist = await client.fetch(`*[_type=="user" && email==$email][0]`, {
    email: req.body.email,
  });
  if (userExist) {
    return res.status(401).send("user already exist");
  }
  const { data } = await axios.post(
    `https://${projectId}.api.sanity.io/v1/data/mutate/${dataset}?returnIds=true`,
    { mutations: createMutations },
    {
      headers: {
        "Content-type": "application/json",
        Authorization: `Bearer ${tokenWithWriteAccess}`,
      },
    }
  );
  const userId = data.results[0].id;
  const user = {
    _id: userId,
    name: req.body.name,
    email: req.body.email,
    isAdmin: false,
  };
  // signToken is used to create jwt
  const token = signToken(user);
  res.send({ ...user, token });
};
export default handler;
