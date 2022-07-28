import React, { useEffect, useState, useReducer } from "react";
import { CheckoutWizard, Layout } from "../components";
import { useGlobalContext } from "../utils/Store";
import Link from "next/link";
import Image from "next/image";
import { urlForThumbnail } from "../utils/image";
import { useRouter } from "next/router";
import { toast } from "react-toastify";
import { getError } from "../utils/error";
import axios from "axios";
import dynamic from "next/dynamic";
import jsCookie from "js-cookie";

const PlaceOrderScreen = () => {
  const { state, dispatch } = useGlobalContext();
  const [loading, setLoading] = useState(false);
  const { cart, userInfo } = state;
  const { cartItems, shippingAddress, payment } = cart;
  const router = useRouter();
  const round2 = (num) => Math.round(num * 100 + Number.EPSILON) / 100;

  const itemsPrice = round2(
    cartItems.reduce((a, c) => a + c.quantity * c.price, 0)
  );
  useEffect(() => {
    if (!payment) {
      router.push("/");
      return;
    }
    // if (cartItems.length === 0) {
    //   router.push("/");
    //   return;
    // }
  }, [payment, router]);
  const shippingPrice = itemsPrice > 200 ? 0 : 15;
  const taxPrice = round2(itemsPrice * 0.15);
  const totalPrice = round2(itemsPrice + shippingPrice + taxPrice);
  const placeOrderHandler = async () => {
    let id;
    try {
      setLoading(true);
      const { data } = await axios.post(
        "/api/orders",
        {
          orderItems: cartItems.map((x) => ({
            ...x,
            countInStock: undefined,
            image: urlForThumbnail(x.image),
            slug: undefined,
            _createdAt: undefined,

            _rev: undefined,
            _type: undefined,
            _updatedAt: undefined,
            breed: undefined,
            category: undefined,
            sex: undefined,
          })),
          shippingAddress,
          paymentMethod: payment,
          shippingPrice,
          itemsPrice,
          taxPrice,
          totalPrice,
        },
        { headers: { authorization: `Bearer ${userInfo.token}` } }
      );
      setLoading(false);

      dispatch({ type: "CART_CLEAR_ITEMS" });

      jsCookie.set(
        "cart",
        JSON.stringify({
          ...cart,
          cartItems: [],
        })
      );
      console.log(data);
      router.push(`/order/${data}`);
    } catch (error) {
      setLoading(false);
      toast.error(getError(error));
    }
  };
  return (
    <Layout title="order">
      <CheckoutWizard activeStep={3} />
      <h1 className="mb-4 text-xl">Place Order</h1>
      {cartItems.length === 0 ? (
        <div>
          Cart is Empty
          <Link href="/">Go Shopping</Link>
        </div>
      ) : (
        <div className="grid md:grid-cols-4 md:gap-5">
          <div className="overflow-x-auto md:col-span-3">
            <div className="card p-5">
              <h2 className="mb-4 text-lg">Shipping Address</h2>
              <div>
                {shippingAddress.fullName} ,{shippingAddress.address} ,{" "}
                {shippingAddress.city} , {shippingAddress.postalCode} ,{" "}
                {shippingAddress.country}
              </div>
              <div>
                <Link href="/shipping">Edit</Link>
              </div>
            </div>
            <div className="card p-5">
              <h2 className=" mb-4 text-lg">Payment Method</h2>
              <div>{payment}</div>
              <div>
                <Link href="/payment">Edit</Link>
              </div>
            </div>
            <div className="card overflow-x-auto p-5">
              <h2 className=" mb-4 text-lg">Orders</h2>
              <table className="min-w-full">
                <thead className="border-b">
                  <tr>
                    <th className="px-5 text-left">Item</th>
                    <th className="px-5 text-right">Quantity</th>
                    <th className="px-5 text-right">Price</th>
                    <th className="px-5 text-right">SubTotal</th>
                  </tr>
                </thead>
                <tbody>
                  {cartItems.map((item) => (
                    <tr className="border-b" key={item._id}>
                      <td>
                        <Link href={`/products/${item.slug.current}`}>
                          <a className="flex items-center">
                            <Image
                              src={urlForThumbnail(item.image)}
                              alt={item.name}
                              width={50}
                              height={50}
                            ></Image>
                            &nbsp;
                            {item.name}
                          </a>
                        </Link>
                      </td>
                      <td className="p-5 text-right">{item.quantity}</td>
                      <td className="p-5 text-right">${item.price}</td>
                      <td className="p-5 text-right">
                        ${item.quantity * item.price}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div>
                <Link href="/cart">Edit</Link>
              </div>
            </div>
          </div>
          <div className="card p-5">
            <h2 className="mb-2 text-lg">Order Summary</h2>
            <ul>
              <li>
                <div className="mb-2 flex justify-between">
                  <div>Items</div>
                  <div>${itemsPrice}</div>
                </div>
              </li>
              <li>
                <div className="mb-2 flex justify-between">
                  <div>Tax</div>
                  <div>${taxPrice}</div>
                </div>
              </li>
              <li>
                <div className="mb-2 flex justify-between">
                  <div>Shipping</div>
                  <div>${shippingPrice}</div>
                </div>
              </li>
              <li>
                <div className="mb-2 flex justify-between">
                  <div>Total</div>
                  <div>${totalPrice}</div>
                </div>
              </li>
              <li>
                <button
                  disabled={loading}
                  onClick={() => placeOrderHandler()}
                  className="primary-button"
                >
                  {loading ? "Loading..." : "Place Order"}
                </button>
              </li>
            </ul>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default dynamic(() => Promise.resolve(PlaceOrderScreen), { ssr: false });
