import Link from "next/link";

import React from "react";
import { urlForThumbnail } from "../utils/image";
import { useGlobalContext } from "../utils/Store";

const AnimalsList = ({ animal }) => {
  const { slug, name, price, image, breed } = animal;
  const { addToCartHandler } = useGlobalContext();

  return (
    <div className="card   bg-base-100 shadow-xl">
      <figure>
        <Link href={`/animals/${slug.current}`}>
          <a>
            <img
              src={`${urlForThumbnail(image)}`}
              alt={breed}
              className="rounded shadow"
            />
          </a>
        </Link>
      </figure>

      <div className="card-body">
        <h2 className="card-title">
          <Link href={`animals/${slug.current}`}>
            <a className="text-lg">{name.toUpperCase()}</a>
          </Link>
        </h2>

        <p className="text-gray-700 text-xl py-2">
          <span className="text-blue-500">Breed</span> : {breed}{" "}
        </p>
        <p className="text-gray-700 text-xl py-2">
          <span className="text-blue-500">Price</span> : {price}Rs
        </p>
        <div className="card-actions justify-end">
          <button
            className="btn btn-primary "
            type="btn"
            onClick={() => addToCartHandler(animal)}
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
};

export default AnimalsList;
