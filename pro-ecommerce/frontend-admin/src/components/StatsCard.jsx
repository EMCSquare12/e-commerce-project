import React from "react";

const StatsCard = ({ title, value, icon: Icon, colorClass }) => (
  <div className="flex items-start justify-between p-5 transition-all bg-white border border-gray-200 shadow-sm rounded-xl md:p-6 hover:shadow-md hover:border-gray-300">
    <div>
      <p className="text-xs font-bold tracking-wide text-gray-500 uppercase">
        {title}
      </p>
      <h3 className="mt-1 text-2xl font-bold text-slate-800 md:text-3xl md:mt-2">
        {value}
      </h3>
    </div>
    <div className={`p-3 rounded-lg flex-shrink-0 ${colorClass}`}>
      <Icon className="w-6 h-6" />
    </div>
  </div>
);

export default StatsCard;
