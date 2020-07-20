import { NavLink } from 'react-router-dom'
import $t from '../../locale'
import { ReactComponent as Right } from '../../assets/right.svg'
import React from 'react'

export default function({ link }) {
  return (
    <div
      className="panel-block panel-footer-link"
      style={{ justifyContent: 'center' }}
    >
      <NavLink className="view-more" to={link}>
        {$t('common_show_all')}
        <Right className="right" />
      </NavLink>
    </div>
  )
}
