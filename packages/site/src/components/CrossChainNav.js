import React from 'react'
import { NavLink } from 'react-router-dom'
import classnames from 'classnames'
import $t from '../locale'

export default function CrossChainNav(props) {
  const { activeKey = 'blocks', className, style } = props
  return (
    <div className={classnames('tabs', className)} style={style}>
      <ul>
        <li className={classnames({ 'is-active': activeKey === 'blocks' })}>
          <NavLink to="/crossblocks/bitcoin/blocks">
            {$t('cross_block_list')}
          </NavLink>
        </li>
        <li className={classnames({ 'is-active': activeKey === 'crosstxs' })}>
          <NavLink to="/crossblocks/bitcoin/crosstxs">
            {$t('cross_tx_list')}
          </NavLink>
        </li>
        <li className={classnames({ 'is-active': activeKey === 'crossbind' })}>
          <NavLink to="/crossblocks/bitcoin/crossbind">
            {$t('cross_bind_address_list')}
          </NavLink>
        </li>
        <li className={classnames({ 'is-active': activeKey === 'deposits' })}>
          <NavLink to="/crossblocks/bitcoin/deposits">
            {$t('deposit_list')}
          </NavLink>
        </li>
        <li
          className={classnames({ 'is-active': activeKey === 'withdrawals' })}
        >
          <NavLink to="/crossblocks/bitcoin/withdrawals">
            {$t('withdraw_list')}
          </NavLink>
        </li>
        <li className={classnames({ 'is-active': activeKey === 'crosshost' })}>
          <NavLink to="/crossblocks/bitcoin/crosshost">
            {$t('cross_host_list')}
          </NavLink>
        </li>
        <li className={classnames({ 'is-active': activeKey === 'claim' })}>
          <NavLink to="/crossblocks/bitcoin/claim">
            {$t('cross_claim_list')}
          </NavLink>
        </li>
      </ul>
    </div>
  )
}
