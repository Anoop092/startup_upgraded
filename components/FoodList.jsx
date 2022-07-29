import Link from "next/link";
import React from "react";
import { urlForThumbnail } from "../utils/image";

const FoodList = ({ food }) => {
  const { name, image, price, slug } = food;
  return (
    <div className="card bg-base-100 shadow-xl">
      <figure>
        <Link href={`/food/${slug.current}`}>
          <a>
            <img
              src={`${urlForThumbnail(image[0])}`}
              alt={name}
              className="rounded shadow"
            />
          </a>
        </Link>
      </figure>
      <div className="card-body">
        <h2 className="card-title">
          <Link href={`food/${slug.current}`}>
            <a className="text-lg">{name.toUpperCase()}</a>
          </Link>
        </h2>

        <p className="text-gray-700 text-xl py-2">
          <span className="text-blue-500">MRP</span> : {price}Rs
        </p>
        <div className="card-actions justify-end">
          <button className="btn btn-primary " type="btn">
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
};

export default FoodList;
