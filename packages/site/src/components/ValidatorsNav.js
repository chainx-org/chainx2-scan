import React from 'react'
import { NavLink } from 'react-router-dom'
import classnames from 'classnames'
import $t from '../locale'

export default function ValidatorsNav(props) {
  const { activeKey = 'validators', className, style } = props
  return (
    <div className={classnames('tabs', className)} style={style}>
      <ul>
        <li className={classnames({ 'is-active': activeKey === 'validators' })}>
          <NavLink to="/validators">{$t('validators')}</NavLink>
        </li>
        <li className={classnames({ 'is-active': activeKey === 'unsettled' })}>
          <NavLink to="/validators/unsettled">{$t('standby_node')}</NavLink>
        </li>
        <li
          className={classnames({ 'is-active': activeKey === 'btc_trustees' })}
        >
          <NavLink to="/validators/btc_trustees">{$t('btc_trustees')}</NavLink>
        </li>
        {/*
        <li className={classnames({ 'is-active': activeKey === 'missed' })}>
          <NavLink to="/validators/missed">{$t('missed_block_stats')}</NavLink>
        </li>
        */}
      </ul>
    </div>
  )
}
