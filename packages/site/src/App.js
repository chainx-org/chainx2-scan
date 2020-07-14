import React from 'react'
import { BrowserRouter as Router } from 'react-router-dom'
import Main from './Main'

function App() {
  return (
    <Router>
      <React.Fragment>
        <Main />
      </React.Fragment>
    </Router>
  )
}

export default App
