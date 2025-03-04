import React from 'react'
import './App.css'
import Scaffold from './komponents/scaffold/Scaffold'

function App() {
  return (
    <div className="app-container">
      <header className="app-header">
        <h1>Kronopendia</h1>
        <p>Interactive Timeline Visualization Platform</p>
      </header>
      <main className="timeline-container">
        <Scaffold width="80%" />
      </main>
    </div>
  )
}

export default App
