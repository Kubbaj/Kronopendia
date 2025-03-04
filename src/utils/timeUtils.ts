// Constants for time calculations
export const UNIVERSE_AGE_YEARS = 13.8e9; // 13.8 billion years

/**
 * Represents a point in time on the cosmic scale
 */
export interface TimePoint {
  // Years before present (0 = now, positive = in the past)
  yearsBP: number;
  // Label for display
  label: string;
}

/**
 * Generates time points for the cosmic scale with landmark dates
 * @param count Number of time points to generate (ignored if using landmark dates)
 * @returns Array of TimePoint objects
 */
export function generateCosmicTimePoints(count: number): TimePoint[] {
  // Create landmark dates at round billion-year intervals
  // Start with the age of the universe (13.8 billion years)
  // Then add round billion-year marks (13, 12, 11, etc.)
  const timePoints: TimePoint[] = [];
  
  // Add the age of the universe as the first point
  timePoints.push({
    yearsBP: UNIVERSE_AGE_YEARS,
    label: '13.8 Bya'
  });
  
  // Add round billion-year intervals
  for (let i = 13; i >= 0; i--) {
    const yearsBP = i * 1e9;
    
    const label = i === 0 
      ? 'Present' 
      : `${i} Bya`;
    
    timePoints.push({
      yearsBP,
      label
    });
  }
  
  return timePoints;
}

/**
 * Calculates the position along the timeline for a given time point
 * @param yearsBP Years before present
 * @param totalWidth Total width of the timeline (usually a percentage)
 * @returns Position as a percentage string
 */
export function calculateTimePosition(yearsBP: number, totalWidth: string): string {
  // Convert totalWidth from percentage to a number
  const widthValue = parseFloat(totalWidth);
  
  // Calculate position as a percentage (0% = oldest, 100% = present)
  const position = (1 - (yearsBP / UNIVERSE_AGE_YEARS)) * 100;
  
  // Ensure position is within bounds
  const boundedPosition = Math.max(0, Math.min(100, position));
  
  return `${boundedPosition}%`;
} 