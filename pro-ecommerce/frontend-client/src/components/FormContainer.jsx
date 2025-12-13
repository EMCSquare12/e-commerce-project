import React from "react";

const FormContainer = ({ children }) => {
  return (
    <div className="container px-4 mx-auto">
      <div className="flex justify-center mt-10">
        <div className="w-full p-8 bg-white border border-gray-200 rounded-lg shadow-sm md:w-1/2 lg:w-1/3">
          {children}
        </div>
      </div>
    </div>
  );
};

export default FormContainer;
