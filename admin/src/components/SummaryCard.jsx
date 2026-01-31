import './SummaryCard.css';

const SummaryCard = ({ title, value, subtitle, icon, trend, trendValue }) => {
  return (
    <div className="summary-card">
      <div className="summary-card-header">
        <h3 className="summary-card-title">{title}</h3>
        {icon && <div className="summary-card-icon">{icon}</div>}
      </div>
      <div className="summary-card-body">
        <div className="summary-card-value">{value}</div>
        {subtitle && <div className="summary-card-subtitle">{subtitle}</div>}
        {trend && trendValue && (
          <div className={`summary-card-trend trend-${trend}`}>
            {trend === 'up' ? '↑' : '↓'} {trendValue}
          </div>
        )}
      </div>
    </div>
  );
};

export default SummaryCard;
