import React, { useEffect, useReducer } from "react";
import { getError } from "../utils/error";
import { toast } from "react-toastify";
import axios from "axios";
import { useGlobalContext } from "../utils/Store";
import { useRouter } from "next/router";
import { Layout, OrderHistoryDetail } from "../components";
import dynamic from "next/dynamic";
const reducer = (state, action) => {
  switch (action.type) {
    case "FETCH_REQUEST": {
      return { ...state, loading: true, err: "" };
    }
    case "FETCH_SUCCESS": {
      return { ...state, orders: action.payload, loading: false };
    }
    case "FETCH_ERROR": {
      return { ...state, loading: false, err: action.payload };
    }

    default:
      return state;
  }
};
const OrderHistoryScreen = () => {
  const [{ loading, err, orders }, dispatch] = useReducer(reducer, {
    loading: true,
    orders: [],
    err: "",
  });
  const { state } = useGlobalContext();
  const { userInfo } = state;
  const router = useRouter();
  useEffect(() => {
    if (!userInfo) {
      router.push("/login");
    }
    const fetchOrder = async () => {
      try {
        dispatch({ type: "FETCH_REQUEST" });
        const { data } = await axios.get("/api/orders/history", {
          headers: { authorization: `Bearer ${userInfo.token}` },
        });

        dispatch({ type: "FETCH_SUCCESS", payload: data });
      } catch (error) {
        dispatch({ type: "FETCH_ERROR", payload: getError(error) });
        toast.error(getError(error));
      }
    };
    fetchOrder();
  }, [router, userInfo, userInfo.token]);
  return (
    <Layout title="Order History">
      <h1 className="text-lg mb-4">ORDER HISTORY</h1>
      {loading ? (
        <div>Loading....</div>
      ) : err ? (
        <div>{err}</div>
      ) : (
        <OrderHistoryDetail orders={orders} />
      )}
    </Layout>
  );
};
export default dynamic(() => Promise.resolve(OrderHistoryScreen), {
  ssr: false,
});
