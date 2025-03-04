import React from 'react';
import './Spokes.css';
import { generateCosmicTimePoints, calculateTimePosition, TimePoint } from '../../utils/timeUtils';

interface SpokesProps {
  count?: number;
  width: string;
}

const Spokes: React.FC<SpokesProps> = ({ count = 10, width }) => {
  // Generate time points for the cosmic scale
  const timePoints = generateCosmicTimePoints(count);
  
  // Generate an array of spokes
  const spokes = timePoints.map((timePoint, index) => {
    // Calculate position based on years before present
    const position = calculateTimePosition(timePoint.yearsBP, width);
    
    return (
      <div key={`spoke-${index}`} className="spoke-container" style={{ left: position }}>
        <div className="spoke" />
        <div className="spoke-label">{timePoint.label}</div>
      </div>
    );
  });

  return (
    <div 
      className="spokes-container"
      style={{ width }}
    >
      {spokes}
    </div>
  );
};

export default Spokes; 