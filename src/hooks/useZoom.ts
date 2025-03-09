import { useState, useCallback } from 'react';
import { TimeScope, DEFAULT_SCOPE, UNIVERSE_AGE_YEARS } from '../utils/timeUtils';

// Calculate the padding needed to make the timeline take up 80% of the width
const PADDING_FACTOR = 0.25; // 80% visible means 10% padding on each side
const PADDING_YEARS = UNIVERSE_AGE_YEARS * PADDING_FACTOR;

// The visual scope includes the padding
const VISUAL_SCOPE: TimeScope = {
  start: UNIVERSE_AGE_YEARS + PADDING_YEARS,
  end: -PADDING_YEARS
};

export function useZoom() {
  // Initialize with the VISUAL_SCOPE instead of DEFAULT_SCOPE
  const [scope, setScope] = useState<TimeScope>(VISUAL_SCOPE);
  
  // Simple function to calculate a new scope when zooming
  const zoom = useCallback((
    pixelPosition: number, 
    totalWidth: number, 
    zoomFactor: number,
    clampedZoomPoint?: number
  ) => {
    // Convert pixel position to a point in time
    const relativePosition = pixelPosition / totalWidth;
    const currentWidth = scope.start - scope.end;
    
    // Use the provided clamped zoom point if available, otherwise calculate it
    let zoomPoint = clampedZoomPoint;
    if (zoomPoint === undefined) {
      zoomPoint = scope.start - (relativePosition * currentWidth);
      // Clamp to timeline bounds
      zoomPoint = Math.min(UNIVERSE_AGE_YEARS, Math.max(0, zoomPoint));
    }
    
    // Calculate new scope width
    const newWidth = currentWidth / zoomFactor;
    
    // When zooming out, check if we should return to visual scope
    if (zoomFactor < 1 && newWidth >= (VISUAL_SCOPE.start - VISUAL_SCOPE.end) * 0.9) {
      setScope(VISUAL_SCOPE);
      return;
    }
    
    // Calculate new start and end based on zoom point
    const newRelativePosition = (scope.start - zoomPoint) / currentWidth;
    const newStart = zoomPoint + (newRelativePosition * newWidth);
    const newEnd = newStart - newWidth;
    
    // Ensure we don't go beyond the visual scope bounds
    setScope({
      start: Math.min(VISUAL_SCOPE.start, Math.max(VISUAL_SCOPE.end, newStart)),
      end: Math.max(VISUAL_SCOPE.end, Math.min(VISUAL_SCOPE.start, newEnd))
    });
  }, [scope]);
  
  // Function to pan the timeline left or right
  const pan = useCallback((deltaX: number, totalWidth: number) => {
    // Calculate how much to pan in years
    const currentWidth = scope.start - scope.end;
    const panAmount = (deltaX / totalWidth) * currentWidth;
    
    // Calculate new start and end points
    const newStart = scope.start + panAmount;
    const newEnd = scope.end + panAmount;
    
    // Ensure we don't go beyond the visual scope bounds
    setScope({
      start: Math.min(VISUAL_SCOPE.start, Math.max(VISUAL_SCOPE.end, newStart)),
      end: Math.max(VISUAL_SCOPE.end, Math.min(VISUAL_SCOPE.start, newEnd))
    });
  }, [scope]);
  
  return {
    scope,
    zoom,
    pan
  };
} 