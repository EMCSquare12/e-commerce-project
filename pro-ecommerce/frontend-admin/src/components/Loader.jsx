import React from "react";

const Loader = () => {
  return (
    <div className="flex items-center justify-center w-full py-20">
      <div
        className="w-12 h-12 border-4 rounded-full md:w-16 md:h-16 border-slate-200 border-t-amber-500 animate-spin"
        role="status"
        aria-label="Loading"
      >
        <span className="sr-only">Loading...</span>
      </div>
    </div>  
  );
};

export default Loader;
