import React from 'react'
import { Route, Switch } from 'react-router'

import BlockDetail from './Detail'
import BlocksList from './List'
import BlockChainNav from '../../components/BlockChainNav'

export default function Blocks() {
  return (
    <Switch>
      <Route path="/blocks/:heightOrHash" component={BlockDetail} />
      <Route
        path="/blocks"
        render={props => (
          <div className="box">
            <BlockChainNav activeKey="blocks" />
            <BlocksList {...props} />
          </div>
        )}
      />
    </Switch>
  )
}
