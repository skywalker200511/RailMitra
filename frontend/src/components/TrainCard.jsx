import React from 'react';

function TrainCard({ trainNumber, trainName, departureTime, arrivalTime, duration, from, to, classes, availability, fare, distance }) {
  const renderAvailability = () => {
    if (!availability) return null;
    return Object.entries(availability).map(([cls, statuses]) => {
      if (Array.isArray(statuses)) {
        return (
          <div key={cls} className="availability-table-container" style={{ marginTop: '0.5rem', backgroundColor: '#f8fafc', padding: '0.5rem', borderRadius: '4px', border: '1px solid #e2e8f0' }}>
            <div style={{ fontWeight: 'bold', marginBottom: '0.25rem', color: '#2d3748' }}>{cls} Class:</div>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
              <tbody>
                {statuses.map((s, i) => {
                  let icon = '✅';
                  let colorClass = 'avail-green';
                  const statusUpper = String(s.status).toUpperCase();
                  if (statusUpper.includes('RAC')) { icon = '⚠️'; colorClass = 'avail-orange'; }
                  else if (statusUpper.includes('WL') || statusUpper.includes('REGRET')) { icon = '❌'; colorClass = 'avail-red'; }
                  
                  return (
                    <tr key={i} className={colorClass} style={{ borderBottom: i < statuses.length - 1 ? '1px solid #edf2f7' : 'none' }}>
                      <td style={{ padding: '0.25rem 0', fontWeight: 500, width: '80px' }}>{s.date}</td>
                      <td style={{ padding: '0.25rem 0' }}>{s.status} {icon}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        );
      }

      // Legacy support for single string or unknown object
      let icon = '✅';
      let colorClass = 'avail-green';
      const safeStatus = typeof statuses === 'object' ? JSON.stringify(statuses) : String(statuses);
      const statusUpper = safeStatus.toUpperCase();
      if (statusUpper.includes('RAC')) { icon = '⚠️'; colorClass = 'avail-orange'; }
      else if (statusUpper.includes('WL') || statusUpper.includes('REGRET')) { icon = '❌'; colorClass = 'avail-red'; }

      return (
        <div key={cls} className={`availability-row ${colorClass}`}>
          <span className="cls-name">{cls}:</span>
          <span className="status-text">{safeStatus} {icon}</span>
        </div>
      );
    });
  };

  // Safe object extraction for from/to
  const getStationName = (station) => {
    if (!station) return '';
    if (typeof station === 'object') return station.code || station.name || JSON.stringify(station);
    return station;
  };

  return (
    <div className="train-card">
      <div className="train-header">
        <strong>{trainNumber} {trainName}</strong>
      </div>
      <div className="train-route">
        <span>{getStationName(from)} {departureTime}</span>
        <span className="arrow">──────→</span>
        <span>{getStationName(to)} {arrivalTime}</span>
      </div>
      <div className="train-meta">
        Duration: {duration} {distance ? `| ${distance}` : ''}
      </div>
      <div className="train-availability">
        {renderAvailability()}
      </div>
      {fare && (
        <div className="train-fare">
          Fare: {typeof fare === 'object' ? JSON.stringify(fare) : fare}
        </div>
      )}
    </div>
  );
}

export default TrainCard;
