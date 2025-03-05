# Kronopendia Timeline Project - Phase One: Basic Backbone

## What We've Accomplished

1. **Timeline Component Structure**:
   - Created a Scaffold component that contains a Spine and Spokes
   - Implemented a clean visual hierarchy with the timeline centered on the page

2. **Spoke System**:
   - Developed a hierarchical system of spokes with 6 size categories: Micro, Minor, Major, Macro, Mega, and Special
   - Consolidated all styling properties in a single configuration object for easy maintenance
   - Implemented automatic label positioning based on spoke height
   - Added special formatting for Minor spoke labels (condensed format like "6B" instead of "6 Bya")

3. **Time Point Generation**:
   - Created a SPOKE_SEQUENCE constant that defines all possible time intervals from 10 billion years down to 1 minute
   - Implemented a static version that uses the first 4 intervals (10B, 5B, 1B, 500M) for the initial view
   - Added special handling for the beginning of the universe (13.8 Bya) and Present

4. **Visual Styling**:
   - Implemented a clean, consistent visual design with appropriate sizing, colors, and typography
   - Used CSS variables and inline styles for flexible, programmatic control of the appearance

## Key Design Decisions

1. **Spoke Hierarchy**:
   - **MEGA-Spokes**: The largest category that encompasses any interval larger than the current Macro interval
   - **Macro-Spokes**: The largest of the four main sequence intervals visible at any zoom level
   - **Major-Spokes**: The second largest interval in the current visible sequence
   - **Minor-Spokes**: The third largest interval in the current visible sequence
   - **Micro-Spokes**: The smallest interval in the current visible sequence
   - **Special-Spokes**: Always visible regardless of zoom level (13.8 Bya and Present)

2. **Size-Shifting Threshold Mechanism**:
   - The system compares the visible range on screen (the "Scope") to the current Macro interval
   - When the visible range becomes smaller than the Macro interval, a size shift occurs:
     - The current Macro intervals join the MEGA category
     - The current Major intervals become the new Macros
     - The current Minor intervals become the new Majors
     - The current Micro intervals become the new Minors
     - The next smaller interval in the sequence becomes the new Micros
   - This ensures that only one MEGA-Spoke can be visible at any time and maintains a clear visual hierarchy

3. **Spoke Sequence**:
   - Defined a sequence of time intervals following powers of 10 interspersed with multiples of 5
   - Sequence covers the full range from 10 billion years to 1 minute
   - At any zoom level, 4 consecutive steps in the sequence are visible with appropriate sizing

## Where We're Heading (Phase Two)

1. **Zooming Functionality**:
   - Implement user controls for zooming in and out on the timeline
   - Create a system to track the current zoom level and visible time range (the "Scope")

2. **Dynamic Size-Shifting**:
   - Implement the size-shifting threshold mechanism where intervals shift categories when the visible range becomes smaller than the current Macro interval
   - Ensure smooth transitions between different zoom levels
   - Handle the MEGA-Spoke category for intervals larger than the current visible range

3. **Dynamic Spoke Generation**:
   - Generate appropriate spokes based on the current zoom level
   - Ensure that only relevant spokes are displayed at each zoom level
   - Maintain the visual hierarchy with 4 main sequence intervals visible at any time

4. **Performance Optimization**:
   - Ensure smooth performance even with many spokes
   - Implement virtualization or culling if necessary for performance

## Code Structure

- **src/komponents/scaffold/Scaffold.tsx**: Main container component for the timeline
- **src/komponents/scaffold/Spine.tsx**: Horizontal line representing the timeline
- **src/komponents/scaffold/Spokes.tsx**: Vertical markers with labels at specific time points
- **src/utils/timeUtils.ts**: Utilities for time calculations, spoke generation, and positioning

## Key Implementation Details

1. **Spoke Configuration**:
   ```typescript
   const spokeSizeConfig: Record<SpokeSize, {
     height: number,
     width: number,
     color: string,
     labelSize: number,
     labelWeight: number,
     labelColor: string,
     isDotted?: boolean
   }> = { ... }
   ```

2. **Spoke Sequence**:
   ```typescript
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
     1/12, 1/52, 1/365, 1/(365*24), 1/(365*24*60)
   ];
   ```

3. **Label Formatting**:
   ```typescript
   const formatSpokeLabel = (label: string, size: SpokeSize): string => {
     if (size === 'minor') {
       if (label.includes('Bya')) return label.replace(' Bya', 'B');
       if (label.includes('Mya')) return label.replace(' Mya', 'M');
       if (label.includes('Kya')) return label.replace(' Kya', 'K');
     }
     return label;
   };
   ``` 