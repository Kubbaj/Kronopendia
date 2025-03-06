import React from 'react';
import './Spine.css';
import { TimeScope, DEFAULT_SCOPE, UNIVERSE_AGE_YEARS } from '../../utils/timeUtils';

interface SpineProps {
  width?: string;
  scope?: TimeScope;
}

const Spine: React.FC<SpineProps> = ({ 
  width = '100%',
  scope = DEFAULT_SCOPE
}) => {
  // Calculate the position of universe start and end within the current scope
  const scopeWidth = scope.start - scope.end;
  
  // Calculate the percentage positions (0% is left edge, 100% is right edge)
  const startPercent = ((scope.start - UNIVERSE_AGE_YEARS) / scopeWidth) * 100;
  const endPercent = ((scope.start - 0) / scopeWidth) * 100;
  
  // Ensure values are within 0-100% range for visibility checking
  const visibleStartPercent = Math.max(0, Math.min(100, startPercent));
  const visibleEndPercent = Math.max(0, Math.min(100, endPercent));
  
  // Only show spine if at least part of it is visible
  const isSpineVisible = visibleStartPercent < 100 && visibleEndPercent > 0;
  
  if (!isSpineVisible) {
    return null;
  }
  
  // Calculate the actual visible portion of the spine
  const spineLeft = `${visibleStartPercent}%`;
  const spineWidth = `${visibleEndPercent - visibleStartPercent}%`;

  return (
    <div className="spine-container">
      <div 
        className="spine-line"
        style={{
          position: 'absolute',
          left: spineLeft,
          width: spineWidth,
          height: '5px',
          backgroundColor: '#000',
          borderRadius: '2px',
          top: '50%',
          transform: 'translateY(-50%)'
        }}
      />
    </div>
  );
};

export default Spine; 