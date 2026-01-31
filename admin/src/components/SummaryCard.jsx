const SummaryCard = ({ title, value, subtitle, icon: Icon, trend, trendValue }) => {
  return (
    <div className="card group">
      <div className="flex items-center justify-between mb-5">
        {Icon && (
          <div className="p-3.5 rounded-xl bg-blue-100 text-blue-600 border border-blue-200 group-hover:scale-110 transition-transform duration-200">
            <Icon className="w-6 h-6" />
          </div>
        )}
        {trend && trendValue && (
          <span
            className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
              trend === 'up'
                ? 'text-green-700 bg-green-100'
                : 'text-red-700 bg-red-100'
            }`}
          >
            {trend === 'up' ? '↑' : '↓'} {trendValue}
          </span>
        )}
      </div>
      <h3 className="text-3xl font-bold text-gray-900 mb-2">{value}</h3>
      <p className="text-sm font-medium text-gray-600">{title}</p>
      {subtitle && <p className="text-xs text-gray-500 mt-1">{subtitle}</p>}
    </div>
  );
};

export default SummaryCard;
