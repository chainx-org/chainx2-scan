import React from 'react'
import { Route, Switch } from 'react-router'
import Blocks from './pages/Blocks'
import Extrinsincs from './pages/Extrinsics'

export default function Main() {
  return (
    <div className="section main-content">
      <section className="container">
        <Switch>
          <Route path="/blocks" component={Blocks} />
          <Route path="/extrinsics" component={Extrinsincs} />
        </Switch>
      </section>
    </div>
  )
}
