import axios from "axios";
import requestValidator from "../../../middelware/requestValidator";
import { signToken } from "../../../utils/auth";
import config from "../../../utils/config";

const handler = async (req, res) => {
  if (req.method !== "PUT") {
    return res.send({ message: "only put request are allowed" });
  }
  const tokenWithWriteAccess = process.env.SANITY_AUTH_TOKEN;
  await axios.post(
    `https://${config.projectId}.api.sanity.io/v1/data/mutate/${config.dataset}`,
    {
      mutations: [
        {
          patch: {
            id: req.user._id,
            set: {
              name: req.body.name,
              email: req.body.email,
            },
          },
        },
      ],
    },
    {
      headers: {
        "Content-type": "application/json",
        Authorization: `Bearer ${tokenWithWriteAccess}`,
      },
    }
  );
  const user = {
    _id: req.user._id,
    name: req.body.name,
    email: req.body.email,
    isAdmin: req.user.isAdmin,
  };
  // signToken is used to create jwt
  const token = signToken(user);
  res.send({ ...user, token });
};
export default requestValidator(handler);
