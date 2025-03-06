import React, { useState } from 'react'
import './App.css'
import Scaffold from './komponents/scaffold/Scaffold'
import { TimeScope, DEFAULT_SCOPE } from './utils/timeUtils'

function App() {
  const [scope, setScope] = useState<TimeScope>(DEFAULT_SCOPE);
  const [isZoomedIn, setIsZoomedIn] = useState(false);
  
  // Handle scope change
  const handleScopeChange = (newScope: TimeScope) => {
    setScope(newScope);
    setIsZoomedIn(newScope.start !== DEFAULT_SCOPE.start || newScope.end !== DEFAULT_SCOPE.end);
  };
  
  return (
    <div className="app-container">
      <header className="app-header">
        <h1>Kronopendia</h1>
        <p>Interactive Timeline Visualization Platform</p>
      </header>
      <main className="timeline-container">
        <Scaffold 
          width={isZoomedIn ? "100%" : "80%"} 
          scope={scope}
          onScopeChange={handleScopeChange}
        />
      </main>
    </div>
  )
}

export default App
