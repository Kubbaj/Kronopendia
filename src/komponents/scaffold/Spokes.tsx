import React from 'react';
import './Spokes.css';

interface SpokesProps {
  count: number;
  width: string;
}

const Spokes: React.FC<SpokesProps> = ({ count, width }) => {
  // Convert width from percentage to a number we can use for calculations
  const widthValue = parseInt(width);
  
  // Generate an array of spokes
  const spokes = Array.from({ length: count }, (_, index) => {
    // Calculate position as a percentage
    const position = `${(index / (count - 1)) * 100}%`;
    
    return (
      <div 
        key={`spoke-${index}`}
        className="spoke"
        style={{ left: position }}
      />
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