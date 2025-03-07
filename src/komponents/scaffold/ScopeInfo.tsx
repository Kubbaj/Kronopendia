import React from 'react';
import './ScopeInfo.css';
import { TimeScope, UNIVERSE_AGE_YEARS } from '../../utils/timeUtils';

interface ScopeInfoProps {
  scope: TimeScope;
  cursorPosition: number | null;
}

// Helper function to format time values in a human-readable way
const formatTimeValue = (years: number, isEdge: boolean = false, isRange: boolean = false): string => {
  // Check for edge cases (universe bounds)
  if (isEdge) {
    if (years >= UNIVERSE_AGE_YEARS) return "MAX";
    if (years <= 0) return "MAX";
  }
  
  const absYears = Math.abs(years);
  
  // For range values, remove the "a" suffix
  const suffix = isRange ? "" : "a";
  
  if (absYears >= 1e9) {
    return `${(years / 1e9).toFixed(2)} By${suffix}`;
  } else if (absYears >= 1e6) {
    return `${(years / 1e6).toFixed(2)} My${suffix}`;
  } else if (absYears >= 1e3) {
    return `${(years / 1e3).toFixed(2)} Ky${suffix}`;
  } else {
    return `${years.toFixed(2)} years`;
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
        {/* Top row - Range */}
        <div className="scope-info-row">
          <div className="scope-info-item scope-info-range">
            <span className="scope-info-label">Range:</span>
            <span className="scope-info-value">
              {isRangeMax ? "MAX" : formatTimeValue(totalRange, false, true)}
            </span>
          </div>
        </div>
        
        {/* Bottom row - Left, Cursor/Center, Right */}
        <div className="scope-info-row">
          <div className="scope-info-item">
            <span className="scope-info-label">Left:</span>
            <span className="scope-info-value">
              {formatTimeValue(scope.start, isAtLeftBound)}
            </span>
          </div>
          
          <div className="scope-info-item">
            <span className="scope-info-label">
              {cursorPosition !== null ? "Cursor:" : "Center:"}
            </span>
            <span className="scope-info-value">
              {formatTimeValue(cursorPosition !== null ? cursorPosition : centerPoint)}
            </span>
          </div>
          
          <div className="scope-info-item">
            <span className="scope-info-label">Right:</span>
            <span className="scope-info-value">
              {formatTimeValue(scope.end, isAtRightBound)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScopeInfo; 