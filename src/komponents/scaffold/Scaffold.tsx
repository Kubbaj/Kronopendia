import React, { useRef, useEffect, useState, useCallback } from 'react';
import Spine from './Spine';
import Spokes from './Spokes';
import ScopeInfo from './ScopeInfo';
import Crosshair from './Crosshair';
import './Scaffold.css';
import { useZoom } from '../../hooks/useZoom';
import { pixelPositionToYearsBP } from '../../utils/timeUtils';

const Scaffold: React.FC = () => {
  // Use our zoom hook
  const { scope, zoom, pan } = useZoom();
  
  // State to track cursor position
  const [cursorPosition, setCursorPosition] = useState<number | null>(null);
  
  // References to various elements
  const scaffoldRef = useRef<HTMLDivElement>(null);
  const appContainerRef = useRef<HTMLDivElement | null>(null);
  const controlsRef = useRef<HTMLDivElement>(null);
  
  // Get a reference to the app container on mount
  useEffect(() => {
    // Find the main app container
    appContainerRef.current = document.querySelector('.app-container') as HTMLDivElement;
  }, []);
  
  // Function to convert pixel position to years BP
  const getYearsBPFromPixel = useCallback((pixelX: number) => {
    if (!scaffoldRef.current) return null;
    
    const rect = scaffoldRef.current.getBoundingClientRect();
    const relativeX = pixelX - rect.left;
    const totalWidth = rect.width;
    
    // Only convert if the X position is within the scaffold width
    if (relativeX >= 0 && relativeX <= totalWidth) {
      return pixelPositionToYearsBP(relativeX, totalWidth, scope);
    }
    return null;
  }, [scope]);
  
  // Handle mouse move on the entire app container
  useEffect(() => {
    const handleGlobalMouseMove = (e: Event) => {
      if (!scaffoldRef.current) return;
      
      // Cast to MouseEvent
      const mouseEvent = e as MouseEvent;
      const { clientX, clientY } = mouseEvent;
      
      // Check if mouse is over controls
      const isOverControls = controlsRef.current && 
        clientX >= controlsRef.current.getBoundingClientRect().left &&
        clientX <= controlsRef.current.getBoundingClientRect().right &&
        clientY >= controlsRef.current.getBoundingClientRect().top &&
        clientY <= controlsRef.current.getBoundingClientRect().bottom;
      
      // Check if mouse is over scope info (directly check for the element)
      const scopeInfoElement = document.querySelector('.scope-info');
      const isOverScopeInfo = scopeInfoElement && 
        clientX >= scopeInfoElement.getBoundingClientRect().left &&
        clientX <= scopeInfoElement.getBoundingClientRect().right &&
        clientY >= scopeInfoElement.getBoundingClientRect().top &&
        clientY <= scopeInfoElement.getBoundingClientRect().bottom;
      
      // If mouse is over UI elements, consider it out of bounds
      if (isOverScopeInfo || isOverControls) {
        setCursorPosition(null);
        return;
      }
      
      // Get the scaffold's horizontal bounds
      const rect = scaffoldRef.current.getBoundingClientRect();
      
      // Check if the cursor is horizontally aligned with the scaffold
      if (clientX >= rect.left && clientX <= rect.right) {
        // Convert the X position to years BP
        const yearsBP = getYearsBPFromPixel(clientX);
        if (yearsBP !== null) {
          setCursorPosition(yearsBP);
        }
      } else {
        // Cursor is outside the scaffold horizontally
        setCursorPosition(null);
      }
    };
    
    // Add event listener to the app container or document
    const container = appContainerRef.current || document;
    container.addEventListener('mousemove', handleGlobalMouseMove);
    
    return () => {
      container.removeEventListener('mousemove', handleGlobalMouseMove);
    };
  }, [getYearsBPFromPixel]);
  
  // Handle mouse leave for the entire document
  useEffect(() => {
    const handleGlobalMouseLeave = (e: Event) => {
      setCursorPosition(null);
    };
    
    // Only set cursor to null when mouse leaves the document
    document.addEventListener('mouseleave', handleGlobalMouseLeave);
    
    return () => {
      document.removeEventListener('mouseleave', handleGlobalMouseLeave);
    };
  }, []);
  
  // Add wheel event listener to the entire document
  useEffect(() => {
    const handleWheel = (e: Event) => {
      if (!scaffoldRef.current) return;
      
      // Cast to WheelEvent
      const wheelEvent = e as WheelEvent;
      
      // Get the scaffold's horizontal bounds
      const rect = scaffoldRef.current.getBoundingClientRect();
      
      // Check if the cursor is horizontally aligned with the scaffold
      if (wheelEvent.clientX >= rect.left && wheelEvent.clientX <= rect.right) {
        // Prevent default scrolling behavior
        wheelEvent.preventDefault();
        
        const pixelPosition = wheelEvent.clientX - rect.left;
        const totalWidth = rect.width;
        
        // Check if shift key is pressed for panning
        if (wheelEvent.shiftKey) {
          // Pan left or right based on wheel direction
          const panDelta = wheelEvent.deltaY > 0 ? 50 : -50;
          pan(panDelta, totalWidth);
        } else {
          // Zoom in or out based on wheel direction
          const zoomFactor = wheelEvent.deltaY < 0 ? 1.1 : 0.9;
          zoom(pixelPosition, totalWidth, zoomFactor);
        }
      }
    };
    
    // Add the wheel event listener to the document or app container
    const container = appContainerRef.current || document;
    
    // Use { passive: false } to allow preventDefault
    container.addEventListener('wheel', handleWheel, { passive: false });
    
    return () => {
      container.removeEventListener('wheel', handleWheel);
    };
  }, [zoom, pan]);
  
  // Handle button clicks
  const handleZoomIn = () => {
    if (!scaffoldRef.current) return;
    const width = scaffoldRef.current.clientWidth;
    
    // Use cursor position if available, otherwise use center
    if (cursorPosition !== null) {
      // Find the pixel position that corresponds to the cursor position
      const scopeWidth = scope.start - scope.end;
      const relativePos = (scope.start - cursorPosition) / scopeWidth;
      const pixelPos = relativePos * width;
      
      zoom(pixelPos, width, 1.25);
    } else {
      zoom(width / 2, width, 1.25); // Zoom in from center
    }
  };
  
  const handleZoomOut = () => {
    if (!scaffoldRef.current) return;
    const width = scaffoldRef.current.clientWidth;
    
    // Use cursor position if available, otherwise use center
    if (cursorPosition !== null) {
      // Find the pixel position that corresponds to the cursor position
      const scopeWidth = scope.start - scope.end;
      const relativePos = (scope.start - cursorPosition) / scopeWidth;
      const pixelPos = relativePos * width;
      
      zoom(pixelPos, width, 0.8);
    } else {
      zoom(width / 2, width, 0.8); // Zoom out from center
    }
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
      >
        <Spine width="100%" scope={scope} />
        <Spokes width="100%" scope={scope} />
        <Crosshair scope={scope} position={cursorPosition} />
      </div>
      
      {/* Scope information display */}
      <ScopeInfo scope={scope} cursorPosition={cursorPosition} />
      
      {/* Zoom and pan controls at the bottom of the screen */}
      <div className="zoom-controls-container" ref={controlsRef}>
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