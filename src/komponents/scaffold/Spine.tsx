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
  
  // Check if the timeline extends beyond view
  const startOffscreen = startPercent < 0;
  const endOffscreen = endPercent > 100;
  
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

  // Spine and arrowhead properties
  const spineHeight = 5; // Height of the spine in px
  const arrowLength = 20; // Length of each arrow line
  const arrowAngle = 30; // Angle of the lines in degrees

  return (
    <div className="spine-container" style={{ zIndex: 10 }}>
      {/* Main spine line */}
      <div 
        className="spine-line"
        style={{
          position: 'absolute',
          left: spineLeft,
          width: spineWidth,
          height: `${spineHeight}px`,
          backgroundColor: '#000',
          borderRadius: `${spineHeight/2}px`,
          top: '50%',
          transform: 'translateY(-50%)',
          zIndex: 10
        }}
      />
      
      {/* Left arrowhead (if timeline extends beyond left edge) */}
      {startOffscreen && (
        <div className="spine-arrowhead spine-arrowhead-left" style={{ 
          position: 'absolute', 
          left: '0', 
          top: '50%', 
          transform: 'translateY(-50%)',
          zIndex: 10
        }}>
          {/* Top line */}
          <div style={{
            position: 'absolute',
            width: `${arrowLength}px`,
            height: `${spineHeight}px`,
            backgroundColor: '#000',
            borderRadius: `${spineHeight/2}px`,
            transformOrigin: 'left center',
            transform: `rotate(-${arrowAngle}deg)`,
            top: `-${spineHeight/2}px`,
            left: 0
          }} />
          
          {/* Bottom line */}
          <div style={{
            position: 'absolute',
            width: `${arrowLength}px`,
            height: `${spineHeight}px`,
            backgroundColor: '#000',
            borderRadius: `${spineHeight/2}px`,
            transformOrigin: 'left center',
            transform: `rotate(${arrowAngle}deg)`,
            top: `-${spineHeight/2}px`,
            left: 0
          }} />
        </div>
      )}
      
      {/* Right arrowhead (if timeline extends beyond right edge) */}
      {endOffscreen && (
        <div className="spine-arrowhead spine-arrowhead-right" style={{ 
          position: 'absolute', 
          right: '0', 
          top: '50%', 
          transform: 'translateY(-50%)',
          zIndex: 10
        }}>
          {/* Top line */}
          <div style={{
            position: 'absolute',
            width: `${arrowLength}px`,
            height: `${spineHeight}px`,
            backgroundColor: '#000',
            borderRadius: `${spineHeight/2}px`,
            transformOrigin: 'right center',
            transform: `rotate(${arrowAngle}deg)`,
            top: `-${spineHeight/2}px`,
            right: 0
          }} />
          
          {/* Bottom line */}
          <div style={{
            position: 'absolute',
            width: `${arrowLength}px`,
            height: `${spineHeight}px`,
            backgroundColor: '#000',
            borderRadius: `${spineHeight/2}px`,
            transformOrigin: 'right center',
            transform: `rotate(-${arrowAngle}deg)`,
            top: `-${spineHeight/2}px`,
            right: 0
          }} />
        </div>
      )}
    </div>
  );
};

export default Spine; 