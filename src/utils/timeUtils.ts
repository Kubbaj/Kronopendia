// Constants for time calculations
export const UNIVERSE_AGE_YEARS = 13.8e9; // 13.8 billion years

// Spoke size types
export type SpokeSize = 'micro' | 'minor' | 'major' | 'macro' | 'special';

/**
 * Represents a point in time on the cosmic scale
 */
export interface TimePoint {
  // Years before present (0 = now, positive = in the past)
  yearsBP: number;
  // Label for display
  label: string;
  // Size/importance of the time point
  size: SpokeSize;
}

/**
 * Determines the appropriate size for a time point based on its position in cosmic history
 */
function determineSpokeSize(yearsBP: number): SpokeSize {
  // Special cases: beginning of universe and present
  if (yearsBP === UNIVERSE_AGE_YEARS || yearsBP === 0) {
    return 'special';
  }
  
  // Macro: 10 billion year mark
  if (yearsBP === 10e9) {
    return 'macro';
  }
  
  // Major: 5 billion year mark
  if (yearsBP === 5e9) {
    return 'major';
  }
  
  // Minor: other billion year marks
  if (yearsBP % 1e9 === 0) {
    return 'minor';
  }
  
  // Micro: everything else
  return 'micro';
}

/**
 * Formats a year value into a human-readable label
 */
function formatYearLabel(yearsBP: number): string {
  if (yearsBP === 0) {
    return 'Present';
  }
  
  if (yearsBP === UNIVERSE_AGE_YEARS) {
    return '13.8 Bya';
  }
  
  // Format billion year values
  if (yearsBP >= 1e9) {
    const billions = yearsBP / 1e9;
    return `${billions} Bya`;
  }
  
  // Format million year values
  if (yearsBP >= 1e6) {
    const millions = yearsBP / 1e6;
    return `${millions} Mya`;
  }
  
  return `${yearsBP} ya`;
}

/**
 * Generates time points for the cosmic scale with landmark dates
 * @returns Array of TimePoint objects
 */
export function generateCosmicTimePoints(count: number): TimePoint[] {
  // Define the specific landmark dates we want to include (in years BP)
  const landmarkDates = [
    UNIVERSE_AGE_YEARS, // 13.8 billion years (beginning of universe)
    13e9,               // 13 billion years
    12e9,               // 12 billion years
    11e9,               // 11 billion years
    10e9,               // 10 billion years
    9e9,                // 9 billion years
    8e9,                // 8 billion years
    7e9,                // 7 billion years
    6e9,                // 6 billion years
    5e9,                // 5 billion years
    4e9,                // 4 billion years
    3e9,                // 3 billion years
    2e9,                // 2 billion years
    1e9,                // 1 billion years
    0                   // Present
  ];
  
  // Create time points from landmark dates
  return landmarkDates.map(yearsBP => ({
    yearsBP,
    label: formatYearLabel(yearsBP),
    size: determineSpokeSize(yearsBP)
  }));
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