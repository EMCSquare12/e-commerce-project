import React from "react";
import { Info, AlertCircle, CheckCircle, AlertTriangle } from "lucide-react";

const Message = ({ variant = "info", children }) => {
  const variants = {
    info: {
      style: "bg-blue-50 border-blue-200 text-blue-800",
      icon: <Info className="w-5 h-5 text-blue-500" />,
    },
    danger: {
      style: "bg-red-50 border-red-200 text-red-800",
      icon: <AlertCircle className="w-5 h-5 text-red-500" />,
    },
    success: {
      style: "bg-green-50 border-green-200 text-green-800",
      icon: <CheckCircle className="w-5 h-5 text-green-500" />,
    },
    warning: {
      style: "bg-amber-50 border-amber-200 text-amber-800",
      icon: <AlertTriangle className="w-5 h-5 text-amber-500" />,
    },
  };

  const { style, icon } = variants[variant] || variants.info;

  return (
    <div
      className={`flex items-start gap-3 p-3 mb-4 text-sm md:text-base border rounded-lg shadow-sm ${style}`}
      role="alert"
    >
      <div className="flex-shrink-0 mt-0.5">{icon}</div>

      {/* Content */}
      <div className="font-medium leading-relaxed">{children}</div>
    </div>
  );
};

export default Message;
