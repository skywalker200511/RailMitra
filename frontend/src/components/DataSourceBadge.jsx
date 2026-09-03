import React from 'react';

function DataSourceBadge({ source }) {
  const isLive = source === 'live';
  return (
    <div className={`data-source-badge ${isLive ? 'badge-live' : 'badge-mock'}`}>
      {isLive && <span className="pulsing-dot"></span>}
      {isLive ? 'LIVE DATA' : 'DEMO DATA'}
    </div>
  );
}

export default DataSourceBadge;
