import './StatusBadge.css';

const StatusBadge = ({ status, type = 'default' }) => {
  const getStatusClass = () => {
    const statusLower = status?.toLowerCase() || '';
    
    if (type === 'payment') {
      if (statusLower.includes('paid') && !statusLower.includes('partially') && !statusLower.includes('not')) {
        return 'status-paid';
      } else if (statusLower.includes('partially')) {
        return 'status-partial';
      } else {
        return 'status-unpaid';
      }
    }
    
    if (type === 'order') {
      if (statusLower === 'delivered') return 'status-success';
      if (statusLower === 'pending') return 'status-warning';
      if (statusLower === 'in transit') return 'status-info';
      return 'status-default';
    }
    
    if (type === 'active') {
      return statusLower === 'true' || statusLower === true ? 'status-active' : 'status-inactive';
    }
    
    // Default status mapping
    if (statusLower === 'completed' || statusLower === 'active' || statusLower === 'paid') {
      return 'status-success';
    }
    if (statusLower === 'pending' || statusLower === 'partially paid') {
      return 'status-warning';
    }
    if (statusLower === 'not paid' || statusLower === 'inactive') {
      return 'status-danger';
    }
    
    return 'status-default';
  };

  return (
    <span className={`status-badge ${getStatusClass()}`}>
      {status || 'N/A'}
    </span>
  );
};

export default StatusBadge;
