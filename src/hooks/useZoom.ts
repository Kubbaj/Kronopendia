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

// Edge padding percentage (matches the initial view)
const EDGE_PADDING_PERCENT = 0.1; // 10% padding on each side

export function useZoom() {
  const [scope, setScope] = useState<TimeScope>(VISUAL_SCOPE);
  
  // Function to ensure timeline endpoints are not too far from screen edges
  const enforceEdgeConstraints = useCallback((newScope: TimeScope): TimeScope => {
    // Calculate the total visible width
    const totalWidth = newScope.start - newScope.end;
    
    // Calculate the positions of timeline endpoints as percentages
    // Where is 13.8 Bya (universe start) in the current view?
    const universeStartPercent = (UNIVERSE_AGE_YEARS - newScope.end) / totalWidth;
    // Where is 0 (present) in the current view?
    const presentEndPercent = (0 - newScope.end) / totalWidth;
    
    let adjustedScope = { ...newScope };
    
    // Check if beginning of universe (13.8 Bya) is too far left (less than 10% from left edge)
    if (universeStartPercent < EDGE_PADDING_PERCENT) {
      // Calculate where the end should be to place universe start at 10% from left edge
      const targetEnd = UNIVERSE_AGE_YEARS - (totalWidth * EDGE_PADDING_PERCENT);
      adjustedScope = {
        start: targetEnd + totalWidth,
        end: targetEnd
      };
    }
    
    // After adjusting for universe start, recalculate for present
    const recalculatedTotalWidth = adjustedScope.start - adjustedScope.end;
    const recalculatedPresentEndPercent = (0 - adjustedScope.end) / recalculatedTotalWidth;
    
    // Check if present (0) is too far right (more than 90% from left edge)
    if (recalculatedPresentEndPercent > (1 - EDGE_PADDING_PERCENT)) {
      // Calculate where the start should be to place present at 90% from left edge
      const targetStart = (totalWidth * (1 - EDGE_PADDING_PERCENT));
      adjustedScope = {
        start: adjustedScope.end + totalWidth,
        end: 0 - targetStart
      };
    }
    
    return adjustedScope;
  }, []);
  
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
    let newScope = {
      start: Math.min(VISUAL_SCOPE.start, Math.max(VISUAL_SCOPE.end, newStart)),
      end: Math.max(VISUAL_SCOPE.end, Math.min(VISUAL_SCOPE.start, newEnd))
    };
    
    // Always apply edge constraints to ensure timeline endpoints are visible
    newScope = enforceEdgeConstraints(newScope);
    
    setScope(newScope);
  }, [scope, enforceEdgeConstraints]);
  
  // Function to pan the timeline left or right
  const pan = useCallback((deltaX: number, totalWidth: number) => {
    // Calculate how much to pan in years
    const currentWidth = scope.start - scope.end;
    const panAmount = (deltaX / totalWidth) * currentWidth;
    
    // Calculate new start and end points
    let newScope = {
      start: scope.start + panAmount,
      end: scope.end + panAmount
    };
    
    // Always apply edge constraints to ensure timeline endpoints are visible
    newScope = enforceEdgeConstraints(newScope);
    
    setScope(newScope);
  }, [scope, enforceEdgeConstraints]);
  
  return {
    scope,
    zoom,
    pan
  };
} 