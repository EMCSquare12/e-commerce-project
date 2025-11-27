import React from "react";

const Message = ({ variant = "info", children }) => {
  const variants = {
    info: "bg-blue-100 border-blue-500 text-blue-700",
    danger: "bg-red-100 border-red-500 text-red-700",
    success: "bg-green-100 border-green-500 text-green-700",
    warning: "bg-yellow-100 border-yellow-500 text-yellow-700",
  };

  return (
    <div
      className={`border-l-4 p-4 mb-4 rounded ${variants[variant]}`}
      role="alert"
    >
      <p className="font-medium">{children}</p>
    </div>
  );
};

export default Message;
