import React from 'react';
import './Spine.css';

interface SpineProps {
  width?: string;
}

const Spine: React.FC<SpineProps> = ({ width = '100%' }) => {
  return (
    <div className="spine-container">
      <div 
        className="spine-line"
        style={{ width }}
      />
    </div>
  );
};

export default Spine; 