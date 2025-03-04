import React from 'react';
import Spine from './Spine';
import Spokes from './Spokes';
import './Scaffold.css';

interface ScaffoldProps {
  width?: string;
  spokeCount?: number;
}

const Scaffold: React.FC<ScaffoldProps> = ({ 
  width = '80%',
  spokeCount = 10
}) => {
  return (
    <div className="scaffold-container">
      <Spine width={width} />
      <Spokes count={spokeCount} width={width} />
    </div>
  );
};

export default Scaffold; 