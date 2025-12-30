const StatsCard = ({ title, value, icon: Icon, colorClass }) => (
  <div className="flex items-start justify-between p-6 transition-all bg-white border border-gray-200 shadow-sm rounded-xl hover:shadow-md">
    <div>
      <p className="text-sm font-medium text-gray-500">{title}</p>
      <h3 className="mt-2 text-3xl font-bold text-gray-800">{value}</h3>
    </div>
    <div className={`p-3 rounded-lg ${colorClass}`}>
      <Icon className="w-6 h-6" />
    </div>
  </div>
);

export default StatsCard;
