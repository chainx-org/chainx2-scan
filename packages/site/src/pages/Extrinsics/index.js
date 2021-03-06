import React from 'react'
import { Route, Switch } from 'react-router'

import BlockChainNav from '../../components/BlockChainNav'
import List from './List'
import SudoExList from './sudoExList'
import Detail from './Detail'

export default function Extrinsics() {
  return (
    <Switch>
      <Route path="/extrinsics/:hash" component={Detail} />
      <Route
        path="/extrinsics"
        render={props => (
          <div className="box">
            <BlockChainNav activeKey="extrinsics" />
            <List {...props} />
          </div>
        )}
      />
      <Route
        path="/sudo_extrinsics"
        render={props => (
          <div className="box">
            <BlockChainNav activeKey="sudo_extrinsics" />
            <SudoExList {...props} />
          </div>
        )}
      />
    </Switch>
  )
}
