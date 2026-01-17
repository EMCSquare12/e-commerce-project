import React from "react";

const FormContainer = ({ children }) => {
  return (
    <div className="container px-4 mx-auto">
      <div className="flex justify-center mt-6 md:mt-10">
        <div className="w-full p-6 transition-all bg-white border border-gray-100 shadow-sm rounded-xl md:p-8 md:w-1/2 lg:w-1/3 hover:shadow-md">
          {children}
        </div>
      </div>
    </div>
  );
};

export default FormContainer;
