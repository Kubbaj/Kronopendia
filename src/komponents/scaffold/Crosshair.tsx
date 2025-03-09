import React from 'react';
import './Crosshair.css';
import { TimeScope, UNIVERSE_AGE_YEARS } from '../../utils/timeUtils';

interface CrosshairProps {
  scope: TimeScope;
  position: number | null; // Position in years BP
}

const Crosshair: React.FC<CrosshairProps> = ({ scope, position }) => {
  // If no position is provided, use the center of the scope
  const centerPoint = scope.start - ((scope.start - scope.end) / 2);
  const isCenterBound = position === null;
  
  // Get the point to use
  let pointToUse = isCenterBound ? centerPoint : position;
  
  // Clamp the point to the timeline bounds (13.8B to 0)
  // This ensures the crosshair freezes at the timeline edges
  if (!isCenterBound && pointToUse !== null) {
    pointToUse = Math.min(UNIVERSE_AGE_YEARS, Math.max(0, pointToUse));
  }
  
  // Calculate the position as a percentage along the timeline
  const scopeWidth = scope.start - scope.end;
  const positionPercent = ((scope.start - pointToUse) / scopeWidth) * 100;
  
  // Ensure the position is within bounds (0-100%)
  const boundedPosition = Math.max(0, Math.min(100, positionPercent));
  
  // Apply different classes based on whether it's center-bound or cursor-bound
  const crosshairClass = isCenterBound ? 'crosshair center-bound' : 'crosshair cursor-bound';
  
  return (
    <div className="crosshair-container">
      <div 
        className={crosshairClass}
        style={{ left: `${boundedPosition}%` }}
      >
        {/* Vertical lines (top and bottom) */}
        <div className="crosshair-line vertical top"></div>
        <div className="crosshair-line vertical bottom"></div>
        
        {/* Horizontal lines (left and right) */}
        <div className="crosshair-line horizontal left"></div>
        <div className="crosshair-line horizontal right"></div>
      </div>
    </div>
  );
};

export default Crosshair; 