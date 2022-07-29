import React from "react";
import FoodList from "./FoodList";

const Food = ({ foods }) => {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-3 lg:grid-cols-4">
      {foods.map((food) => (
        <FoodList food={food} key={food.name} />
      ))}
    </div>
  );
};

export default Food;
