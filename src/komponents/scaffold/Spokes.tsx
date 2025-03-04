import React from 'react';
import './Spokes.css';
import { generateCosmicTimePoints, calculateTimePosition, TimePoint, SpokeSize } from '../../utils/timeUtils';

interface SpokesProps {
  width: string;
}

// Configuration for different spoke sizes with all styling properties
const spokeSizeConfig: Record<SpokeSize, {
  height: number,
  width: number,
  color: string,
  labelSize: number,
  labelWeight: number,
  labelColor: string,
  isDotted?: boolean
}> = {
  'micro': { 
    height: 20, 
    width: 1, 
    color: '#999',
    labelSize: 0,  // Hidden
    labelWeight: 400,
    labelColor: '#999'
  },
  'minor': { 
    height: 50, 
    width: 2, 
    color: '#666',
    labelSize: 10,
    labelWeight: 500,
    labelColor: '#666'
  },
  'major': { 
    height: 75, 
    width: 3, 
    color: '#444',
    labelSize: 11,
    labelWeight: 600,
    labelColor: '#444'
  },
  'macro': { 
    height: 100, 
    width: 5, 
    color: '#333',
    labelSize: 12,
    labelWeight: 600,
    labelColor: '#333'
  },
  'mega': { 
    height: 150, 
    width: 10, 
    color: '#222',
    labelSize: 13,
    labelWeight: 700,
    labelColor: '#222'
  },
  'special': { 
    height: 150, 
    width: 2, 
    color: '#333',
    labelSize: 12,
    labelWeight: 700,
    labelColor: '#000',
    isDotted: true
  }
};

// Constant for label padding (space between spoke end and label)
const LABEL_PADDING = 10;

const Spokes: React.FC<SpokesProps> = ({ width }) => {
  // Generate time points for the cosmic scale
  const timePoints = generateCosmicTimePoints();
  
  // Generate an array of spokes
  const spokes = timePoints.map((timePoint, index) => {
    // Calculate position based on years before present
    const position = calculateTimePosition(timePoint.yearsBP, width);
    
    // Get configuration for this spoke size
    const config = spokeSizeConfig[timePoint.size];
    
    // Determine if label should be shown
    const showLabel = config.labelSize > 0;
    
    // Create inline styles for the spoke
    const spokeStyle: React.CSSProperties = {
      height: `${config.height}px`,
      width: config.isDotted ? '0' : `${config.width}px`,
      backgroundColor: config.isDotted ? 'transparent' : config.color,
      borderLeft: config.isDotted ? `${config.width}px dotted ${config.color}` : 'none'
    };
    
    // Create inline styles for the label
    const labelStyle: React.CSSProperties = {
      top: `calc(50% + ${config.height / 2 + LABEL_PADDING}px)`,
      fontSize: `${config.labelSize}px`,
      fontWeight: config.labelWeight,
      color: config.labelColor,
      display: showLabel ? 'block' : 'none'
    };
    
    return (
      <div key={`spoke-${index}`} className="spoke-container" style={{ left: position }}>
        <div className="spoke" style={spokeStyle} />
        <div className="spoke-label" style={labelStyle}>{timePoint.label}</div>
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