import React from 'react'
import './App.css'
import Spine from './komponents/scaffold/Spine'

function App() {
  return (
    <div className="app-container">
      <header className="app-header">
        <h1>Kronopendia</h1>
        <p>Interactive Timeline Visualization Platform</p>
      </header>
      <main className="timeline-container">
        <Spine width="80%" />
      </main>
    </div>
  )
}

export default App
