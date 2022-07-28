import axios from "axios";
import requestValidator from "../../../middelware/requestValidator";
import config from "../../../utils/config";

const handler = async (req, res) => {
  if (req.method !== "POST") {
    return;
  }
  const projectId = config.projectId;
  const dataset = config.dataset;
  const tokenWithWriteAccess = process.env.SANITY_AUTH_TOKEN;

  const { data } = await axios.post(
    `https://${projectId}.api.sanity.io/v1/data/mutate/${dataset}?returnIds=true`,
    {
      mutations: [
        {
          create: {
            _type: "order",
            createdAt: new Date().toISOString(),
            ...req.body,
            userName: req.user.name,
            user: {
              _type: "reference",
              _ref: req.user._id,
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
  res.status(201).send(data.results[0].id);
};
export default requestValidator(handler);
