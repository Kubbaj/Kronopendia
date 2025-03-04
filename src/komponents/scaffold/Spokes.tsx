import React from 'react';
import './Spokes.css';
import { generateCosmicTimePoints, calculateTimePosition, TimePoint, SpokeSize } from '../../utils/timeUtils';

interface SpokesProps {
  count?: number;
  width: string;
}

// Configuration for different spoke sizes
const spokeSizeConfig: Record<SpokeSize, { height: number, labelHeight: number }> = {
  'micro': { height: 20, labelHeight: 0 }, // No label for micro
  'minor': { height: 40, labelHeight: 20 },
  'major': { height: 50, labelHeight: 25 },
  'macro': { height: 55, labelHeight: 27.5 },
  'special': { height: 60, labelHeight: 30 }
};

const Spokes: React.FC<SpokesProps> = ({ count = 10, width }) => {
  // Generate time points for the cosmic scale
  const timePoints = generateCosmicTimePoints(count);
  
  // Generate an array of spokes
  const spokes = timePoints.map((timePoint, index) => {
    // Calculate position based on years before present
    const position = calculateTimePosition(timePoint.yearsBP, width);
    
    // Get configuration for this spoke size
    const config = spokeSizeConfig[timePoint.size];
    
    // Determine classes based on size
    const spokeClassName = `spoke spoke-${timePoint.size}`;
    const labelClassName = timePoint.size === 'micro' 
      ? 'spoke-label spoke-label-hidden' 
      : `spoke-label spoke-label-${timePoint.size}`;
    
    // Set the spoke height for label positioning
    const labelStyle = { '--spoke-height': `${config.labelHeight}px` } as React.CSSProperties;
    
    return (
      <div key={`spoke-${index}`} className="spoke-container" style={{ left: position }}>
        <div className={spokeClassName} style={{ height: `${config.height}px` }} />
        <div className={labelClassName} style={labelStyle}>{timePoint.label}</div>
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