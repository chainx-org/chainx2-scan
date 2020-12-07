import React from 'react'
import { NavLink } from 'react-router-dom'
import classnames from 'classnames'
import $t from '../locale'

export default function BlockChainNav(props) {
  const { activeKey, className, style } = props
  return (
    <div className={classnames('tabs', className)} style={style}>
      <ul>
        <li className={classnames({ 'is-active': activeKey === 'blocks' })}>
          <NavLink to="/blocks">{$t('block_list')}</NavLink>
        </li>
        <li className={classnames({ 'is-active': activeKey === 'extrinsics' })}>
          <NavLink to="/extrinsics">{$t('ex_list')}</NavLink>
        </li>
        <li className={classnames({ 'is-active': activeKey === 'events' })}>
          <NavLink to="/events">{$t('event_list')}</NavLink>
        </li>
        <li className={classnames({ 'is-active': activeKey === 'accounts' })}>
          <NavLink to="/accounts">{$t('accounts_list')}</NavLink>
        </li>
        <li
          className={classnames({
            'is-active': activeKey === 'sudo_extrinsics'
          })}
        >
          <NavLink to="/sudo_extrinsics">{$t('sudo_ex_list')}</NavLink>
        </li>
        <li
            className={classnames({
              'is-active': activeKey === 'runtime_history'
            })}
        >
          <NavLink to="/runtimeHistory">{$t('code_Update')}</NavLink>
        </li>
      </ul>
    </div>
  )
}
