import { useState, useCallback } from 'react';
import { TimeScope, DEFAULT_SCOPE, UNIVERSE_AGE_YEARS } from '../utils/timeUtils';

// Calculate the padding needed to make the timeline take up 80% of the width
const PADDING_FACTOR = 0.25; // 80% visible means 10% padding on each side (10/80 = 0.125, but we need it relative to the total, so 0.125/0.8 = 0.15625)
const PADDING_YEARS = UNIVERSE_AGE_YEARS * PADDING_FACTOR;

// The visual scope includes the padding
const VISUAL_SCOPE: TimeScope = {
  start: UNIVERSE_AGE_YEARS + PADDING_YEARS,
  end: -PADDING_YEARS
};

export function useZoom() {
  const [scope, setScope] = useState<TimeScope>(VISUAL_SCOPE);
  
  // Check if we're at the default visual scope
  const isDefaultScope = scope.start === VISUAL_SCOPE.start && scope.end === VISUAL_SCOPE.end;
  
  // Simple function to calculate a new scope when zooming
  const zoom = useCallback((pixelPosition: number, totalWidth: number, zoomFactor: number) => {
    // Convert pixel position to a point in time
    const relativePosition = pixelPosition / totalWidth;
    const currentWidth = scope.start - scope.end;
    const zoomPoint = scope.start - (relativePosition * currentWidth);
    
    // Calculate new scope width
    const newWidth = currentWidth / zoomFactor;
    
    // When zooming out, check if we should return to default
    if (zoomFactor < 1 && newWidth >= (VISUAL_SCOPE.start - VISUAL_SCOPE.end) * 0.9) {
      setScope(VISUAL_SCOPE);
      return;
    }
    
    // Calculate new start and end based on zoom point
    const newStart = zoomPoint + (relativePosition * newWidth);
    const newEnd = newStart - newWidth;
    
    // Ensure we don't go beyond the visual scope bounds
    setScope({
      start: Math.min(VISUAL_SCOPE.start, Math.max(VISUAL_SCOPE.end, newStart)),
      end: Math.max(VISUAL_SCOPE.end, Math.min(VISUAL_SCOPE.start, newEnd))
    });
  }, [scope]);
  
  return {
    scope,
    isDefaultScope,
    zoom
  };
} 