import React from 'react'
import { NavLink, useLocation, withRouter } from 'react-router-dom'
import chainxLogo from '../../assets/chainxLogo.png'
import $t from '../../locale'
import classnames from 'classnames'
import { matchPath } from 'react-router'
import InputSearch from '../../components/InputSearch'
export default withRouter(function(props) {
  const { location } = props
  const isMatchBlocks = ['/extrinsics', '/events', 'blocks', '/accounts'].some(
    path => !!matchPath(location.pathname, { path })
  )
  const isMatchCrossBlocks = ['/crossblocks'].some(
    path => !!matchPath(location.pathname, { path })
  )
  return (
    <nav className="navbar" role="navigation">
      <div className="container">
        <div className="navbar-brand">
          <NavLink to="/" className="navbar-item" activeClassName="selected">
            <img src={chainxLogo} alt="chainx" width="112" height="28" />
          </NavLink>
        </div>

        <div className={classnames('navbar-menu')}>
          <div className="navbar-start">
            <NavLink
              exact
              className="navbar-item is-tab"
              activeClassName="is-active"
              to="/"
            >
              {$t('common_home')}
            </NavLink>
            <NavLink
              className={classnames('navbar-item is-tab', {
                'is-active': isMatchBlocks
              })}
              activeClassName="is-active"
              to="/blocks"
            >
              {$t('common_blockchain')}
            </NavLink>
            <NavLink
              className={classnames('navbar-item is-tab', {
                'is-active': isMatchCrossBlocks
              })}
              activeClassName="is-active"
              to="/crossblocks"
            >
              {$t('cross_block')}
            </NavLink>
            <NavLink
              className="navbar-item is-tab"
              activeClassName="is-active"
              to="/dex"
            >
              {$t('dex_section')}
            </NavLink>
          </div>
          <div className="navbar-end">
            <InputSearch {...props} />
          </div>
        </div>
      </div>
    </nav>
  )
})
