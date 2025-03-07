import React from 'react';
import './ScopeInfo.css';
import { TimeScope, UNIVERSE_AGE_YEARS } from '../../utils/timeUtils';

interface ScopeInfoProps {
  scope: TimeScope;
  cursorPosition: number | null;
}

// Helper function to format time values in a more compact way
const formatTimeValue = (years: number, isEdge: boolean = false): string => {
  // Check for edge cases (universe bounds)
  if (isEdge) {
    if (years >= UNIVERSE_AGE_YEARS) return "MAX";
    if (years <= 0) return "MAX";
  }
  
  const absYears = Math.abs(years);
  
  if (absYears >= 1e9) {
    return `${(years / 1e9).toFixed(1)}B`;
  } else if (absYears >= 1e6) {
    return `${(years / 1e6).toFixed(1)}M`;
  } else if (absYears >= 1e3) {
    return `${(years / 1e3).toFixed(1)}K`;
  } else {
    return `${years.toFixed(1)}`;
  }
};

const ScopeInfo: React.FC<ScopeInfoProps> = ({ scope, cursorPosition }) => {
  // Calculate the total visible time range
  const totalRange = scope.start - scope.end;
  
  // Calculate the center point (used for button zooming)
  const centerPoint = scope.start - (totalRange / 2);
  
  // Check if we're at the universe bounds
  const isAtLeftBound = scope.start >= UNIVERSE_AGE_YEARS;
  const isAtRightBound = scope.end <= 0;
  const isRangeMax = totalRange >= UNIVERSE_AGE_YEARS;
  
  return (
    <div className="scope-info">
      <div className="scope-info-content">
        {/* Top row - Left, Cursor/Center, Right */}
        <div className="scope-info-row">
          <div className="scope-info-value">
            {formatTimeValue(scope.start, isAtLeftBound)}
          </div>
          
          <div className="scope-info-value scope-info-cursor">
            {formatTimeValue(cursorPosition !== null ? cursorPosition : centerPoint)}
          </div>
          
          <div className="scope-info-value">
            {formatTimeValue(scope.end, isAtRightBound)}
          </div>
        </div>
        
        {/* Bottom row - Range */}
        <div className="scope-info-row">
          <div className="scope-info-range">
            {isRangeMax ? "MAX" : formatTimeValue(totalRange)}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScopeInfo; 