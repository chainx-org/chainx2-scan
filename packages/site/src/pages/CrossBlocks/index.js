import React from 'react'
import { Route, Switch } from 'react-router'
import { NavLink } from 'react-router-dom'
import classnames from 'classnames'
import BitcoinImg from '../../assets/crossblocks/bitcoin.jpg'
import DepositMineImg from '../../assets/crossblocks/deposit_mine.jpg'
import $t from '../../locale'

import CrossChainNav from '../../components/CrossChainNav'
import CrossBlockList from './Bitcoin/CrossBlockList'
import CrossBtcTx from './Bitcoin/CrossBtcTx'

// import DepositsMine from "./DepositsMine";

/*
import CrossTxs from "./CrossTxs";
import CrossBind from "./CrossBind";
import CrossHost from "./CrossHost";
import CrossDeposits from "./CrossDeposits";
import CrossWithdrawals from "./CrossWithdrawals";
import CrossClaim from "./CrossClaim";
*/

/*
import BlockDetail from './Detail'
import BlockChainNav from '../../components/BlockChainNav'
import BlocksList from './List'
*/

export default function CrossBlocks(props) {
  const activeKey = props.location.pathname
  return (
    <>
      <div className="tabs top">
        <ul>
          <li
            className={classnames({
              'is-active':
                activeKey.includes('/crossblocks/bitcoin') ||
                activeKey === '/crossblocks'
            })}
          >
            <NavLink to="/crossblocks/bitcoin">
              <img className="tab-img" src={BitcoinImg} alt="Bitcoin转接桥" />
              {$t('bitcoin_bridge')}
            </NavLink>
          </li>
          <li
            className={classnames({
              'is-active': activeKey === '/crossblocks/depositMine'
            })}
          >
            <NavLink to="/crossblocks/depositMine">
              <img className="tab-img" src={DepositMineImg} alt="跨链挖矿" />
              {$t('deposit_mining')}
            </NavLink>
          </li>
        </ul>
      </div>
      <Switch>
        <Route
          path="/crossblocks/depositMine"
          render={props => <CrossBlockList {...props} />}
        />
        <Route
          path="/crossblocks/:bitcoin?/:list?"
          render={props => {
            const {
              match: {
                params: { bitcoin, list }
              }
            } = props
            return (
              <>
                {(!bitcoin || bitcoin === 'bitcoin') && (
                  <div className="box">
                    <CrossChainNav activeKey={list} />
                    {(!list || list === 'blocks') && (
                      <CrossBlockList {...props} />
                    )}
                    {list === 'crosstx' && <CrossBtcTx {...props} />}
                    {list === 'crossbind' && <CrossBlockList {...props} />}
                    {list === 'crosshost' && <CrossBlockList {...props} />}
                    {list === 'deposits' && <CrossBlockList {...props} />}
                    {list === 'withdrawals' && <CrossBlockList {...props} />}
                    {list === 'claim' && <CrossBlockList {...props} />}
                  </div>
                )}
              </>
            )
          }}
        />
      </Switch>
    </>
  )
}
