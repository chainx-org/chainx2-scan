import React from 'react'
import { BrowserRouter as Router } from 'react-router-dom'
import Main from './Main'
import Header from './pages/Header'

import { AppContextProvider } from "./components/AppContext";

function App() {

  return (
    <Router>
      <React.Fragment>
        <Header />

        <Main />

      </React.Fragment>
    </Router>
  )
}

export default App

