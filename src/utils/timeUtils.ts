// Constants for time calculations
export const UNIVERSE_AGE_YEARS = 13.8e9; // 13.8 billion years

// Spoke size types
export type SpokeSize = 'micro' | 'minor' | 'major' | 'macro' | 'mega' | 'special';

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
 * Defines the sequence of time intervals for spokes
 * Each entry represents a time interval in years
 */
export const SPOKE_SEQUENCE = [
  // Billions of years
  10e9, 5e9, 1e9,
  // Millions of years
  500e6, 100e6, 50e6, 10e6, 5e6, 1e6,
  // Thousands of years
  500e3, 100e3, 50e3, 10e3, 5e3, 1e3,
  // Hundreds to single years
  500, 100, 50, 10, 5, 1,
  // Sub-year intervals
  1/12, // 1 month
  1/52, // 1 week
  1/365, // 1 day
  1/(365*24), // 1 hour
  1/(365*24*60) // 1 minute
];

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
  
  // Format thousand year values
  if (yearsBP >= 1e3) {
    const thousands = yearsBP / 1e3;
    return `${thousands} Kya`;
  }
  
  // Format year values
  if (yearsBP >= 1) {
    return `${yearsBP} ya`;
  }
  
  // Format month values
  if (yearsBP >= 1/12) {
    const months = Math.round(yearsBP * 12);
    return `${months} month${months !== 1 ? 's' : ''}`;
  }
  
  // Format week values
  if (yearsBP >= 1/52) {
    const weeks = Math.round(yearsBP * 52);
    return `${weeks} week${weeks !== 1 ? 's' : ''}`;
  }
  
  // Format day values
  if (yearsBP >= 1/365) {
    const days = Math.round(yearsBP * 365);
    return `${days} day${days !== 1 ? 's' : ''}`;
  }
  
  // Format hour values
  if (yearsBP >= 1/(365*24)) {
    const hours = Math.round(yearsBP * 365 * 24);
    return `${hours} hour${hours !== 1 ? 's' : ''}`;
  }
  
  // Format minute values
  const minutes = Math.round(yearsBP * 365 * 24 * 60);
  return `${minutes} minute${minutes !== 1 ? 's' : ''}`;
}

/**
 * Generates time points for the current view based on the Spoke-Sequence
 * For now, we'll use a static implementation with the first 4 intervals
 * in the sequence (10B, 5B, 1B, 500M)
 */
export function generateCosmicTimePoints(): TimePoint[] {
  // For the static implementation, we'll use the first 4 intervals in the sequence
  const activeIntervals = SPOKE_SEQUENCE.slice(0, 4);
  const [macroInterval, majorInterval, minorInterval, microInterval] = activeIntervals;
  
  // Start with special points (beginning of universe and present)
  const specialPoints: TimePoint[] = [
    {
      yearsBP: UNIVERSE_AGE_YEARS,
      label: formatYearLabel(UNIVERSE_AGE_YEARS),
      size: 'special'
    },
    {
      yearsBP: 0,
      label: formatYearLabel(0),
      size: 'special'
    }
  ];
  
  // Generate points for each interval type
  const timePoints: TimePoint[] = [];
  
  // Generate macro points (10B years)
  for (let year = macroInterval; year < UNIVERSE_AGE_YEARS; year += macroInterval) {
    timePoints.push({
      yearsBP: year,
      label: formatYearLabel(year),
      size: 'macro'
    });
  }
  
  // Generate major points (5B years)
  for (let year = majorInterval; year < UNIVERSE_AGE_YEARS; year += majorInterval) {
    // Skip if this point coincides with a macro point
    if (year % macroInterval !== 0) {
      timePoints.push({
        yearsBP: year,
        label: formatYearLabel(year),
        size: 'major'
      });
    }
  }
  
  // Generate minor points (1B years)
  for (let year = minorInterval; year < UNIVERSE_AGE_YEARS; year += minorInterval) {
    // Skip if this point coincides with a macro or major point
    if (year % macroInterval !== 0 && year % majorInterval !== 0) {
      timePoints.push({
        yearsBP: year,
        label: formatYearLabel(year),
        size: 'minor'
      });
    }
  }
  
  // Generate micro points (500M years)
  for (let year = microInterval; year < UNIVERSE_AGE_YEARS; year += microInterval) {
    // Skip if this point coincides with a macro, major, or minor point
    if (year % macroInterval !== 0 && year % majorInterval !== 0 && year % minorInterval !== 0) {
      timePoints.push({
        yearsBP: year,
        label: formatYearLabel(year),
        size: 'micro'
      });
    }
  }
  
  // Combine all points and sort by yearsBP (descending)
  return [...specialPoints, ...timePoints].sort((a, b) => b.yearsBP - a.yearsBP);
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