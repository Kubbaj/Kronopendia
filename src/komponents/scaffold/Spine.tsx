import React from 'react';
import './Spine.css';
import { TimeScope, DEFAULT_SCOPE } from '../../utils/timeUtils';

interface SpineProps {
  width?: string;
  scope?: TimeScope;
}

const Spine: React.FC<SpineProps> = ({ 
  width = '100%',
  scope = DEFAULT_SCOPE
}) => {
  // Calculate the width and position of the spine based on the current scope
  // When zoomed in, the spine will expand beyond the container
  const spineStyle: React.CSSProperties = {
    width: '100%', // Always fill the container width
    position: 'absolute',
    left: '0',
    right: '0'
  };

  return (
    <div className="spine-container">
      <div 
        className="spine-line"
        style={spineStyle}
      />
    </div>
  );
};

export default Spine; 