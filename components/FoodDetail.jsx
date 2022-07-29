import Image from "next/image";
import React from "react";
import { urlFor } from "../utils/image";
import { useGlobalContext } from "../utils/Store";

const FoodDetail = ({ food }) => {
  const { addToCartHandler } = useGlobalContext();
  const {
    image,
    name,
    category,
    for: fors,
    details,
    price,
    countInStock,
  } = food;

  return (
    <div className="grid md:grid-cols-4 gap-3">
      <div className="md:col-span-3 ">
        <div className="hero min-h-screen bg-base-200">
          <div className="hero-content flex-col lg:flex-row">
            <div className="flex flex-col">
              <div className="carousel w-full">
                {image.map((x, index) => (
                  <div
                    key={index}
                    id={`item${index + 1}`}
                    className="carousel-item w-full"
                  >
                    <img src={urlFor(x)} alt={name} className="w-full" />
                  </div>
                ))}
              </div>
              <div className="flex justify-center w-full py-2 gap-2">
                <a href="#item1" className="btn btn-xs">
                  1
                </a>
                <a href="#item2" className="btn btn-xs">
                  2
                </a>
                <a href="#item3" className="btn btn-xs">
                  3
                </a>
              </div>
            </div>
            <div>
              <h1 className="text-5xl font-bold">{name}</h1>
              <p className="py-6">{details}</p>

              <p className="py-6">
                <span className="text-blue-700">Category:</span>
                {category}
              </p>
              <p className="py-6">
                <span className="text-blue-700">For:</span>
                {fors}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div>
        <div className="card p-5">
          <div className="flex justify-between mb-2">
            <div>Price:</div>
            <div>{price}Rs</div>
          </div>
          <div className="flex justify-between mb-2 ">
            <div>Status</div>
            <div>{countInStock > 0 ? "inStock" : "out of stock"}</div>
          </div>
          <button
            className="primary-button"
            onClick={() => addToCartHandler(food)}
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
};

export default FoodDetail;
