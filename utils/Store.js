import React, { useContext, useReducer } from "react";
import Cookies from "js-cookie";
import reducer from "./reducer";
import axios from "axios";
import { toast } from "react-toastify";
import { useRouter } from "next/router";

const Store = React.createContext();
const initialState = {
  cart: Cookies.get("cart")
    ? JSON.parse(Cookies.get("cart"))
    : {
        cartItems: [],
        productItems: [],
        shippingAddress: Cookies.get("location")
          ? JSON.parse(Cookies.get("location"))
          : {},
        payment: "",
      },
  userInfo: Cookies.get("userInfo")
    ? JSON.parse(Cookies.get("userInfo"))
    : null,
};

export function StoreProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const router = useRouter();

  const addToCartHandler = async (someData) => {
    const existingItem = state.cart.cartItems.find(
      (x) => x._id === someData._id
    );
    const quantity = existingItem ? existingItem.quantity + 1 : 1;
    let data1;
    if (someData._type === "food") {
      const { data } = await axios.get(`/api/products/${someData._id}`);
      data1 = data;
    } else {
      const { data } = await axios.get(`/api/animals/${someData._id}`);
      data1 = data;
    }

    if (data1.countInStock < quantity) {
      return toast.error("Sorry.Product is out of stock");
    }
    dispatch({ type: "ADD_TO_CART", payload: { ...someData, quantity } });
    toast.success("successfully added to cart");
    router.push("/cart");
  };

  const updateCartHandler = async (item, qty) => {
    const quantity = Number(qty);

    const { data } = await axios.get(`/api/animals/${item._id}`);

    if (data.countInStock < quantity) {
      return toast.error("Sorry.Product is out of stock");
    }
    dispatch({ type: "ADD_TO_CART", payload: { ...item, quantity } });
    toast.success("Updated the cart");
  };
  const removeCartHandler = async (item) => {
    dispatch({ type: "DELETE_CART_ITEM", payload: item });
    toast.success("Successfully deleted cart item");
  };
  return (
    <Store.Provider
      value={{
        state,
        dispatch,
        addToCartHandler,
        updateCartHandler,
        removeCartHandler,
      }}
    >
      {children}
    </Store.Provider>
  );
}
export function useGlobalContext() {
  return useContext(Store);
}
