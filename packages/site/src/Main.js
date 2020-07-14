import React from 'react'
import { Route, Switch } from 'react-router'
import Blocks from './pages/Blocks'

export default function Main() {
  return (
    <div className="section main-content">
      <section className="container">
        <Switch>
          <Route path="/blocks" component={Blocks} />
        </Switch>
      </section>
    </div>
  )
}
