import React from "react";
import { Layout } from "../../components";
import Link from "next/link";

import CartDetail from "../../components/CartDetail";
import { useGlobalContext } from "../../utils/Store";
import dynamic from "next/dynamic";
const CartScreen = () => {
  const { state } = useGlobalContext();
  const {
    cart: { cartItems },
  } = state;
  return (
    <Layout title="Shopping Cart">
      <h2 className="text-xl text-center text-red-400">Shopping Cart</h2>
      {cartItems.length === 0 ? (
        <div className="flex flex-col item-center ">
          <h3>Oops there are no cart items </h3>
          <Link href="/">
            <a className="text-blue-600 text-lg">Go for Shopping</a>
          </Link>
        </div>
      ) : (
        <CartDetail cartItems={cartItems} />
      )}
    </Layout>
  );
};

export default dynamic(() => Promise.resolve(CartScreen), { ssr: false });
