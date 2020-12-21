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
import Search from './pages/Search'
import SS58 from './pages/Tools/SS58'
// import ReactGA from 'react-ga'

export default function Main() {
  /*
  useEffect(() => {
    ReactGA.set({ page: window.location.pathname }) // Update the user's current page
    ReactGA.pageview(window.location.pathname + window.location.search)
  })
  */
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
          <Route path="/search" component={Search} />
          <Route path="/ss58" component={SS58} />
          <Route path="/runtimeHistory" component={Blocks} />
        </Switch>
      </section>
    </div>
  )
}
