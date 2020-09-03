import React from 'react'
import { Route, Switch } from 'react-router'

import BlockChainNav from '../../components/BlockChainNav'
import List from './AccountsLlist'
import Detail from './Detail'
import TransferList from './Detail/transferlist'

export default function Accounts() {
    return (
        <Switch>
            <Route path="/accounts/:address" component={Detail} />
            <Route path="/accounts/transfer" component={Detail} />

            <Route
                path="/accounts"
                render={props => (
                    <div className="box">
                        <BlockChainNav activeKey="accounts" />
                        <List {...props} />
                    </div>
                )}
            />
        </Switch>
    )
}
