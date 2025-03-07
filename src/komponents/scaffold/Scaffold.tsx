import React, { useRef, useEffect, useState } from 'react';
import Spine from './Spine';
import Spokes from './Spokes';
import ScopeInfo from './ScopeInfo';
import './Scaffold.css';
import { useZoom } from '../../hooks/useZoom';
import { pixelPositionToYearsBP } from '../../utils/timeUtils';

const Scaffold: React.FC = () => {
  // Use our zoom hook
  const { scope, zoom, pan } = useZoom();
  
  // State to track cursor position
  const [cursorPosition, setCursorPosition] = useState<number | null>(null);
  
  // Reference to the scaffold content div for measuring
  const scaffoldRef = useRef<HTMLDivElement>(null);
  
  // Add wheel event listener
  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      if (!scaffoldRef.current) return;
      
      e.preventDefault();
      
      const rect = scaffoldRef.current.getBoundingClientRect();
      const pixelPosition = e.clientX - rect.left;
      const totalWidth = rect.width;
      
      // Check if shift key is pressed for panning
      if (e.shiftKey) {
        // Pan left or right based on wheel direction
        const panDelta = e.deltaY > 0 ? 50 : -50; // Adjust this value to control pan speed
        pan(panDelta, totalWidth);
      } else {
        // Zoom in or out based on wheel direction
        const zoomFactor = e.deltaY < 0 ? 1.1 : 0.9;
        zoom(pixelPosition, totalWidth, zoomFactor);
      }
    };
    
    const element = scaffoldRef.current;
    if (element) {
      element.addEventListener('wheel', handleWheel, { passive: false });
      return () => {
        element.removeEventListener('wheel', handleWheel);
      };
    }
  }, [zoom, pan]);
  
  // Handle mouse move to update cursor position
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!scaffoldRef.current) return;
    
    const rect = scaffoldRef.current.getBoundingClientRect();
    const pixelPosition = e.clientX - rect.left;
    const totalWidth = rect.width;
    
    // Convert pixel position to years BP
    const yearsBP = pixelPositionToYearsBP(pixelPosition, totalWidth, scope);
    setCursorPosition(yearsBP);
  };
  
  // Handle mouse leave to clear cursor position
  const handleMouseLeave = () => {
    setCursorPosition(null);
  };
  
  // Handle button clicks
  const handleZoomIn = () => {
    if (!scaffoldRef.current) return;
    const width = scaffoldRef.current.clientWidth;
    zoom(width / 2, width, 1.25); // Zoom in from center
  };
  
  const handleZoomOut = () => {
    if (!scaffoldRef.current) return;
    const width = scaffoldRef.current.clientWidth;
    zoom(width / 2, width, 0.8); // Zoom out from center
  };
  
  // Handle panning with buttons
  const handlePanLeft = () => {
    if (!scaffoldRef.current) return;
    const width = scaffoldRef.current.clientWidth;
    pan(-width * 0.1, width); // Pan left by 10% of the width
  };
  
  const handlePanRight = () => {
    if (!scaffoldRef.current) return;
    const width = scaffoldRef.current.clientWidth;
    pan(width * 0.1, width); // Pan right by 10% of the width
  };
  
  return (
    <div className="scaffold-container">
      <div 
        className="scaffold-content" 
        ref={scaffoldRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        <Spine width="100%" scope={scope} />
        <Spokes width="100%" scope={scope} />
      </div>
      
      {/* Scope information display */}
      <ScopeInfo scope={scope} cursorPosition={cursorPosition} />
      
      {/* Zoom and pan controls at the bottom of the screen */}
      <div className="zoom-controls-container">
        <div className="zoom-controls">
          <button onClick={handlePanLeft}>&lt;</button>
          <button onClick={handleZoomOut}>-</button>
          <button onClick={handleZoomIn}>+</button>
          <button onClick={handlePanRight}>&gt;</button>
        </div>
      </div>
    </div>
  );
};

export default Scaffold; 