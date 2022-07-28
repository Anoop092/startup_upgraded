import React from "react";
import { urlFor } from "../utils/image";
import Image from "next/image";
import { useGlobalContext } from "../utils/Store";
const AnimalDetails = ({ animal }) => {
  const {
    name,
    breed,
    countInStock,
    price,
    description,
    category,
    sex,
    image,
  } = animal;
  const { addToCartHandler } = useGlobalContext();
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 md: gap-3">
      <div className="md:col-span-2">
        <Image
          src={urlFor(image)}
          alt={name}
          width={630}
          height={630}
          layout="responsive"
        ></Image>
      </div>
      <div>
        <ul className="flex flex-col items-start text-center">
          <li>
            <h1 className="text-lg text-orange-600 ">{name}</h1>
          </li>
          <li>
            <span className="text-blue-700">Category:</span>
            {category}
          </li>
          <li>
            <span className="text-blue-700">Breed:</span>
            {breed}
          </li>
          <li>
            <span className="text-blue-700"> Sex:</span>
            {sex}
          </li>

          <li>{description}</li>
        </ul>
      </div>
      <div>
        <div className="card p-5">
          <div className="flex justify-between mb-2">
            <div>Price:</div>
            <div>${price}</div>
          </div>
          <div className="flex justify-between mb-2 ">
            <div>Status</div>
            <div>{countInStock > 0 ? "In Stock" : "Unavailable"}</div>
          </div>
          <button
            className="primary-button"
            onClick={() => addToCartHandler(animal)}
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
};

export default AnimalDetails;
