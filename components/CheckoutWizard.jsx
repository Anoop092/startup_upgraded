import React from "react";

const CheckoutWizard = ({ activeStep = 0 }) => {
  return (
    <div className=" mb-5 flex flex-wrap">
      {["User Login", "Shipping Address", "Payment Method", "Place Order"].map(
        (item, index) => (
          <div
            key={item}
            className={`flex-1 border-b-2 text-center
                ${
                  index <= activeStep
                    ? "border-indigo-500 text-indigo-500"
                    : "border-gray-300 text-gray-300"
                }
                `}
          >
            {item}
          </div>
        )
      )}
    </div>
  );
};

export default CheckoutWizard;
