import React from 'react';

function TrainCard({ trainNumber, trainName, departureTime, arrivalTime, duration, from, to, classes, availability, fare, distance }) {
  const renderAvailability = () => {
    if (!availability) return null;
    return Object.entries(availability).map(([cls, status]) => {
      let icon = '✅';
      let colorClass = 'avail-green';
      const statusUpper = String(status).toUpperCase();
      
      if (statusUpper.includes('RAC')) {
        icon = '⚠️';
        colorClass = 'avail-orange';
      } else if (statusUpper.includes('WL') || statusUpper.includes('REGRET')) {
        icon = '❌';
        colorClass = 'avail-red';
      }

      return (
        <div key={cls} className={`availability-row ${colorClass}`}>
          <span className="cls-name">{cls}:</span>
          <span className="status-text">{status} {icon}</span>
        </div>
      );
    });
  };

  return (
    <div className="train-card">
      <div className="train-header">
        <strong>{trainNumber} {trainName}</strong>
      </div>
      <div className="train-route">
        <span>{from} {departureTime}</span>
        <span className="arrow">──────→</span>
        <span>{to} {arrivalTime}</span>
      </div>
      <div className="train-meta">
        Duration: {duration} {distance ? `| ${distance}` : ''}
      </div>
      <div className="train-availability">
        {renderAvailability()}
      </div>
      {fare && (
        <div className="train-fare">
          Fare: {fare}
        </div>
      )}
    </div>
  );
}

export default TrainCard;
