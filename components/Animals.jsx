import React from "react";
import AnimalsList from "./AnimalsList";

const Animals = ({ animals }) => {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-3 lg:grid-cols-4">
      {animals.map((animal) => (
        <AnimalsList animal={animal} key={animal.name} />
      ))}
    </div>
  );
};

export default Animals;
