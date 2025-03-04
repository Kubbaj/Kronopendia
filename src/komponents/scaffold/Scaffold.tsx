import React from 'react';
import Spine from './Spine';
import Spokes from './Spokes';
import './Scaffold.css';

interface ScaffoldProps {
  width?: string;
}

const Scaffold: React.FC<ScaffoldProps> = ({ 
  width = '80%'
}) => {
  return (
    <div className="scaffold-container">
      <div className="scaffold-content" style={{ width }}>
        <Spine width="100%" />
        <Spokes width="100%" />
      </div>
    </div>
  );
};

export default Scaffold; 