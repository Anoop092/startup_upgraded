import axios from "axios";
import requestValidator from "../../../../middelware/requestValidator";
import config from "../../../../utils/config";

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
            id: req.query.id,
            set: {
              isPaid: true,
              paidAt: new Date().toISOString(),
              "paymentResult.id": req.body.razorpay_payment_id,
              "paymentResult.status": "paid",
              "paymentResult.email_address": req.user.email,
              "paymentResult.razor_order_id": req.body.razorpay_order_id,
              "paymentResult.razor_signature": req.body.razorpay_signature,
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

  res.send({ message: "order paid" });
};
export default requestValidator(handler);
