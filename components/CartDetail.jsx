import React from "react";
import { urlForThumbnail } from "../utils/image";
import { XCircleIcon } from "@heroicons/react/outline";
import Link from "next/link";
import Image from "next/image";
import { useGlobalContext } from "../utils/Store";
import { useRouter } from "next/router";

const CartDetail = ({ cartItems }) => {
  const { updateCartHandler, removeCartHandler } = useGlobalContext();
  const router = useRouter();
  return (
    <div className="grid md:grid-cols-4 md:gap-5">
      <div className="overflow-x-auto md:col-span-3">
        <table className="min-w-full">
          <thead className="border-b">
            <tr>
              <th className="px-5 text-left">Animal</th>
              <th className="px-5 text-right">Quantity</th>
              <th className="px-5 text-right">Price</th>
              <th className="px-5">Action</th>
            </tr>
          </thead>
          <tbody>
            {cartItems.map((item) => (
              <tr key={item.slug.current} className="border-b">
                <td>
                  <div className="flex items-center space-x-3">
                    <div className="avatar">
                      <div className="mask mask-squircle w-12 h-12">
                        <Link href={`/products/${item.slug.current}`}>
                          <a className="flex items-center">
                            <Image
                              src={urlForThumbnail(
                                item._type === "food"
                                  ? item.image[0]
                                  : item.image
                              )}
                              alt={item.name}
                              width={50}
                              height={50}
                            ></Image>
                          </a>
                        </Link>
                      </div>
                    </div>
                    <div>
                      <div>
                        <div className="font-bold">{item.name}</div>
                      </div>
                    </div>
                  </div>
                </td>
                <td className="p-5 text-right">
                  <select
                    value={item.quantity}
                    onChange={(e) => updateCartHandler(item, e.target.value)}
                  >
                    {[...Array(item.countInStock).keys()].map((x) => (
                      <option key={x + 1} value={x + 1}>
                        {x + 1}
                      </option>
                    ))}
                  </select>
                </td>
                <td className="p-5 text-right">${item.price}</td>
                <td className="p-5 text-center">
                  <button onClick={() => removeCartHandler(item)}>
                    <XCircleIcon className="h-5 w-5"></XCircleIcon>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body">
          <h2 className="card-tile">
            SubTotal({cartItems.reduce((a, c) => a + c.quantity, 0)})
          </h2>
          <p>{cartItems.reduce((a, c) => a + c.quantity * c.price, 0)}Rs</p>

          <div className="card-actions justify-end">
            <button
              className="btn btn-primary"
              onClick={() => router.push("/shipping")}
            >
              Check out
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartDetail;
