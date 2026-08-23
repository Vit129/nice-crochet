import React from 'react';

export const StatsRow: React.FC = () => {
  return (
    <div className="wrap">
      <div className="stat-row">
        <div className="stat">
          <b>4</b>
          <span>product families</span>
        </div>
        <div className="stat">
          <b>7+</b>
          <span>yarn colourways</span>
        </div>
        <div className="stat">
          <b>100%</b>
          <span>hand-looped, no machines</span>
        </div>
      </div>
    </div>
  );
};
