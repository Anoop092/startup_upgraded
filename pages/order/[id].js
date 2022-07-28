import axios from "axios";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import React, { useEffect, useReducer } from "react";
import { Layout, Order } from "../../components";
import { getError } from "../../utils/error";
import { useGlobalContext } from "../../utils/Store";

import { toast } from "react-toastify";

function reducer(state, action) {
  switch (action.type) {
    case "FETCH_REQUEST": {
      return { ...state, loading: true, err: "" };
    }
    case "FETCH_SUCCESS": {
      return { ...state, order: action.payload, loading: false, err: "" };
    }
    case "FETCH_ERROR": {
      return { ...state, loading: false, err: action.payload };
    }
    case "PAY_REQUEST":
      return { ...state, loadingPay: true };
    case "PAY_SUCCESS":
      return { ...state, loadingPay: false, successPay: true };
    case "PAY_FAIL":
      return { ...state, loadingPay: false, errorPay: action.payload };
    case "PAY_RESET":
      return { ...state, loadingPay: false, successPay: false, errorPay: "" };

    default:
      return state;
  }
}

const OrderScreen = ({ params }) => {
  const { id } = params;

  const router = useRouter();
  const [{ loading, err, order, successPay }, dispatch] = useReducer(reducer, {
    loading: true,
    order: {},
    err: "",
  });
  const { state } = useGlobalContext();
  const { userInfo } = state;

  const {
    shippingAddress,
    paymentMethod,
    orderItems,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
    isPaid,
    paidAt,
    isDelivered,
    deliveredAt,
  } = order;
  const makePayment = async () => {
    const { data } = await axios.post("/api/keys/rozarpay", {
      amount: totalPrice,
    });
    const options = (options = {
      key: process.env.KEY_ID, // Enter the Key ID generated from the Dashboard
      name: "Anoop",
      currency: data.currency,
      amount: data.amount,
      order_id: data.id,
      description: "Thankyou for buying product",

      handler: async function (response) {
        // Validate payment at server - using webhooks is a better idea.
        try {
          dispatch({ type: "PAY_REQUEST" });
          const { data } = await axios.put(
            `/api/orders/${order._id}/pay`,
            response,
            {
              headers: { authorization: `Bearer ${userInfo.token}` },
            }
          );
          dispatch({ type: "PAY_SUCCESS", payload: data });
          toast.success("Order is paid");
        } catch (error) {
          dispatch({ type: "PAY_ERROR", payload: getError(error) });
          toast.error(getError(error));
        }
      },
      prefill: {
        name: "Manu Arora",
        email: "manuarorawork@gmail.com",
        contact: "9999999999",
      },
    });
    const paymentObject = new window.Razorpay(options);
    paymentObject.open();
  };

  useEffect(() => {
    if (!userInfo) {
      router.push("/login");
      return;
    }

    async function fetchOrder() {
      try {
        dispatch({ type: "FETCH_REQUEST" });
        const { data } = await axios.get(`/api/orders/${id}`, {
          headers: {
            authorization: `Bearer ${userInfo.token}`,
          },
        });

        dispatch({ type: "FETCH_SUCCESS", payload: data });
      } catch (error) {
        dispatch({ type: "FETCH_ERROR", payload: getError(error) });
      }
    }
    if (!order._id || successPay || (order._id && order._id !== id)) {
      fetchOrder();
      if (successPay) {
        dispatch({ type: "PAY_RESET" });
      }
    } else {
      //script loading for payment gateway
      const initializeRozarpay = () => {
        return new Promise((resolve) => {
          const script = document.createElement("script");
          script.src = "https://checkout.razorpay.com/v1/checkout.js";
          script.onload = () => {
            resolve(true);
          };
          script.onerror = () => {
            resolve(false);
          };

          document.body.appendChild(script);
        });
      };
      initializeRozarpay();
    }
  }, [id, order, router, successPay, userInfo]);

  return (
    <Layout title={`Order-${id}`}>
      {loading ? (
        <div>Loading...</div>
      ) : err ? (
        <div>{err}</div>
      ) : (
        <Order order={order} makePayment={makePayment} />
      )}
    </Layout>
  );
};

export function getServerSideProps(ctx) {
  const { params } = ctx;

  return {
    props: {
      params,
    },
  };
}

export default dynamic(() => Promise.resolve(OrderScreen), { ssr: false });
