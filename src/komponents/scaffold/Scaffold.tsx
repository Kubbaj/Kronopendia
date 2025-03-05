import React, { useState, useRef, useEffect } from 'react';
import Spine from './Spine';
import Spokes from './Spokes';
import './Scaffold.css';
import { TimeScope, DEFAULT_SCOPE, calculateZoomedScope, pixelPositionToYearsBP, UNIVERSE_AGE_YEARS } from '../../utils/timeUtils';

interface ScaffoldProps {
  initialWidth?: string;
}

const Scaffold: React.FC<ScaffoldProps> = ({ 
  initialWidth = '80%'
}) => {
  // State for current scope (visible time range)
  const [scope, setScope] = useState<TimeScope>(DEFAULT_SCOPE);
  
  // State to track if we're in the initial view or zoomed in
  const [isZoomedIn, setIsZoomedIn] = useState(false);
  
  // Reference to the scaffold content div for measuring
  const scaffoldRef = useRef<HTMLDivElement>(null);
  
  // Check if we're zoomed in based on the scope
  useEffect(() => {
    // If the scope is smaller than the full timeline, we're zoomed in
    const isZoomed = scope.start !== UNIVERSE_AGE_YEARS || scope.end !== 0;
    setIsZoomedIn(isZoomed);
  }, [scope]);
  
  // Handle zoom in button click
  const handleZoomIn = () => {
    const centerPoint = scope.start - (scope.start - scope.end) / 2;
    setScope(prevScope => calculateZoomedScope(prevScope, centerPoint, 2));
  };
  
  // Handle zoom out button click
  const handleZoomOut = () => {
    const centerPoint = scope.start - (scope.start - scope.end) / 2;
    setScope(prevScope => calculateZoomedScope(prevScope, centerPoint, 0.5));
  };
  
  // Handle mouse wheel for zooming
  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    
    if (scaffoldRef.current) {
      // Get the x-coordinate relative to the scaffold
      const rect = scaffoldRef.current.getBoundingClientRect();
      const pixelPosition = e.clientX - rect.left;
      const totalWidth = rect.width;
      
      // Convert pixel position to years BP
      const zoomPoint = pixelPositionToYearsBP(pixelPosition, totalWidth, scope);
      
      // Determine zoom factor based on wheel direction
      const zoomFactor = e.deltaY < 0 ? 1.2 : 0.8;
      
      // Update scope
      setScope(prevScope => calculateZoomedScope(prevScope, zoomPoint, zoomFactor));
    }
  };
  
  // Calculate the current width based on zoom state
  const currentWidth = isZoomedIn ? '100%' : initialWidth;
  
  return (
    <div className="scaffold-container">
      <div 
        className="scaffold-content" 
        style={{ width: currentWidth }}
        ref={scaffoldRef}
        onWheel={handleWheel}
      >
        <Spine width="100%" scope={scope} />
        <Spokes width="100%" scope={scope} />
      </div>
      
      {/* Simple zoom controls */}
      <div className="zoom-controls">
        <button onClick={handleZoomOut}>-</button>
        <button onClick={handleZoomIn}>+</button>
      </div>
    </div>
  );
};

export default Scaffold; 