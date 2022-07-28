import React, { useEffect, useState } from "react";
import { CheckoutWizard, Layout } from "../../components";
import { useRouter } from "next/router";

import { toast } from "react-toastify";
import Cookies from "js-cookie";
import { useGlobalContext } from "../../utils/Store";

const PaymentScreen = () => {
  const router = useRouter();
  const [selectedPaymentMethod, setSelectedPayment] = useState("");
  const { state, dispatch } = useGlobalContext();
  const { cart } = state;
  const { cartItems, shippingAddress, payment } = cart;

  const submitHandler = (evt) => {
    evt.preventDefault();
    if (!selectedPaymentMethod) {
      return toast.error("payment method is required");
    }
    dispatch({ type: "SAVE_PAYMENT_METHOD", payload: selectedPaymentMethod });
    Cookies.set(
      "cart",
      JSON.stringify({
        ...cart,
        payment: selectedPaymentMethod,
      })
    );
    router.push("/placeorder");
  };
  useEffect(() => {
    if (cartItems.length === 0) {
      router.push("/");
      return;
    }
    if (!shippingAddress.address) {
      router.push("/shipping");
      return;
    }
    setSelectedPayment(payment || "");
  }, [payment, router, shippingAddress, cartItems]);
  return (
    <Layout title="Payment method">
      <CheckoutWizard activeStep={2} />
      <form className="mx-auto max-w-screen-md" onSubmit={submitHandler}>
        <h1 className="mb-4 text-xl">Payment Method</h1>
        {["Paypal", "Stripe", "CashOnDelivery"].map((item) => (
          <div key={item}>
            <input
              name="PaymentMethod"
              className="p-2 outline-none focus:ring-0"
              id={item}
              type="radio"
              checked={selectedPaymentMethod === item}
              onChange={() => setSelectedPayment(item)}
            />
            <label className="p-2" htmlFor={item}>
              {item}
            </label>
          </div>
        ))}
        <div className="mb-4 flex justify-between">
          <button
            onClick={() => router.push("/shipping")}
            type="button"
            className="default-button"
          >
            Back
          </button>
          <button className="rounded bg-orange-500 py-2 px-4 text-white text-lg shadow outline-none hover:bg-orange-300 ">
            Next
          </button>
        </div>
      </form>
    </Layout>
  );
};

export default PaymentScreen;
