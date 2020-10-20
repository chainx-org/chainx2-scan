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
import CrossDeposits from './Bitcoin/CrossDeposits'
import CrossWithdrawals from './Bitcoin/CrossWithdrawals'
import CrossHost from './Bitcoin/CrossHost'
import CrossUnclaim from './Bitcoin/CrossUnclaim'

import DepositMine from './DepositMine'

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
          render={props => <DepositMine {...props} />}
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
                    {/*
                    {list === 'crossbind' && <CrossBlockList {...props} />}
                    */}
                    {list === 'deposits' && <CrossDeposits {...props} />}
                    {list === 'withdrawals' && <CrossWithdrawals {...props} />}
                    {list === 'crosshost' && <CrossHost {...props} />}
                    {list === 'unclaim' && <CrossUnclaim {...props} />}
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
