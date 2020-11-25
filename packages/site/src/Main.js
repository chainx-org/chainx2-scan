import React, { useEffect } from 'react'
import { Route, Switch } from 'react-router'
import Blocks from './pages/Blocks'
import Validators from './pages/Validators'
import CrossBlocks from './pages/CrossBlocks'
import Extrinsincs from './pages/Extrinsics'
import Events from './pages/Events'
import Accounts from './pages/Accounts'
import ScrollTop from './components/ScrollTop'
import Home from './pages/Home'
import Dex from './pages/Dex'
import './services/socket'
import ReactGA from 'react-ga'

export default function Main() {
  useEffect(() => {
    ReactGA.initialize('G-PRHJ576SN0')
    ReactGA.pageview(window.location.pathname)
    /*
    history.listen(location => {
      ReactGA.initialize('G-CSRS4R2T7N')
      ReactGA.set({ page: location.pathname }) // Update the user's current page
      ReactGA.pageview(location.pathname) // Record a pageview for the given page
    })
    */
  })
  return (
    <div className="section main-content">
      <section className="container">
        <ScrollTop />
        <Switch>
          <Route exact path="/" component={Home} />
          <Route path="/blocks" component={Blocks} />
          <Route path="/validators" component={Validators} />
          <Route path="/crossblocks" component={CrossBlocks} />
          <Route path="/extrinsics" component={Extrinsincs} />
          <Route path="/sudo_extrinsics" component={Extrinsincs} />
          <Route path="/events" component={Events} />
          <Route path="/accounts" component={Accounts} />
          <Route path="/dex" component={Dex} />
        </Switch>
      </section>
    </div>
  )
}
