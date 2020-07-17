import React from 'react'
import { Route, Switch } from 'react-router'
import Blocks from './pages/Blocks'
import Extrinsincs from './pages/Extrinsics'
import Events from './pages/Events'
import ScrollTop from './components/ScrollTop'
import Home from './pages/Home'
import './services/socket'

export default function Main() {
  return (
    <div className="section main-content">
      <section className="container">
        <ScrollTop />
        <Switch>
          <Route exact path="/" component={Home} />
          <Route path="/blocks" component={Blocks} />
          <Route path="/extrinsics" component={Extrinsincs} />
          <Route path="/events" component={Events} />
        </Switch>
      </section>
    </div>
  )
}
