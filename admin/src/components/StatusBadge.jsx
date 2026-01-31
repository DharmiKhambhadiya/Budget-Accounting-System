const StatusBadge = ({ status, type = 'default' }) => {
  const getStatusClasses = () => {
    const statusLower = status?.toLowerCase() || '';
    
    if (type === 'payment') {
      if (statusLower.includes('paid') && !statusLower.includes('partially') && !statusLower.includes('not')) {
        return 'bg-green-100 text-green-700 border-green-200';
      } else if (statusLower.includes('partially')) {
        return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      } else {
        return 'bg-red-100 text-red-700 border-red-200';
      }
    }
    
    if (type === 'order') {
      if (statusLower === 'delivered') return 'bg-green-100 text-green-700 border-green-200';
      if (statusLower === 'pending') return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      if (statusLower === 'in transit') return 'bg-blue-100 text-blue-700 border-blue-200';
      return 'bg-gray-100 text-gray-700 border-gray-200';
    }
    
    if (type === 'active') {
      return statusLower === 'true' || statusLower === true 
        ? 'bg-green-100 text-green-700 border-green-200'
        : 'bg-gray-100 text-gray-700 border-gray-200';
    }
    
    // Default status mapping
    if (statusLower === 'completed' || statusLower === 'active' || statusLower === 'paid') {
      return 'bg-green-100 text-green-700 border-green-200';
    }
    if (statusLower === 'pending' || statusLower === 'partially paid') {
      return 'bg-yellow-100 text-yellow-700 border-yellow-200';
    }
    if (statusLower === 'not paid' || statusLower === 'inactive') {
      return 'bg-red-100 text-red-700 border-red-200';
    }
    
    return 'bg-gray-100 text-gray-700 border-gray-200';
  };

  return (
    <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-semibold border ${getStatusClasses()}`}>
      {status || 'N/A'}
    </span>
  );
};

export default StatusBadge;
