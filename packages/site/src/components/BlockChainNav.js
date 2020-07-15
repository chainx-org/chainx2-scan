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
      </ul>
    </div>
  )
}
