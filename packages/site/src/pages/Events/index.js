import EventsList from './List'
import BlockChainNav from '../../components/BlockChainNav'
import { Route, Switch } from 'react-router'
import Detail from './Detail'
import React from 'react'

export default function Events() {
  return (
    <Switch>
      <Route path="/events/:eventId" component={Detail} />
      <Route
        path="/events"
        render={props => (
          <div className="box">
            <BlockChainNav activeKey="events" />
            <EventsList {...props} />
          </div>
        )}
      />
    </Switch>
  )
}
