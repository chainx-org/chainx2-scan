import React from 'react'
import { NavLink, useLocation, withRouter } from 'react-router-dom'
import chainxLogo from '../../assets/chainxLogo.png'
import $t from '../../locale'
import classnames from 'classnames'
import { matchPath } from 'react-router'
import InputSearch from '../../components/InputSearch'
export default withRouter(function(props) {
  const { location } = props
  const isMatchBlocks = [
    '/extrinsics',
    '/events',
    'blocks',
    '/accounts',
    '/sudo_extrinsics'
  ].some(path => !!matchPath(location.pathname, { path }))
  const isMatchCrossBlocks = ['/crossblocks'].some(
    path => !!matchPath(location.pathname, { path })
  )
  const isMatchValidators = ['/validators'].some(
    path => !!matchPath(location.pathname, { path })
  )
  const [active, SetActive] = React.useState(false)
  return (
    <nav className="navbar" role="navigation" aria-label="main navigation">
      <div className="container">
        <div className="navbar-brand">
          <NavLink to="/" className="navbar-item" activeClassName="selected">
            <img src={chainxLogo} alt="chainx" width="112" height="28" />
          </NavLink>
          <a
            role="button"
            className="navbar-burger burger"
            aria-label="menu"
            aria-expanded="false"
            data-target="navbarBasicExample"
            style={{ color: 'white' }}
            onClick={() => {
              SetActive(!active)
            }}
          >
            <span aria-hidden="true"></span>
            <span aria-hidden="true"></span>
            <span aria-hidden="true"></span>
          </a>
        </div>
        <div
          id="navbarBasicExample"
          className={classnames('navbar-menu', active ? 'is-active' : '')}
          style={{ background: 'rgba(63, 63, 63)' }}
        >
          <div className="navbar-start">
            <NavLink
              exact
              className="navbar-item is-tab"
              activeClassName="is-active"
              onClick={() => {
                SetActive(!active)
              }}
              to="/"
            >
              {$t('common_home')}
            </NavLink>
            <NavLink
              className={classnames('navbar-item is-tab', {
                'is-active': isMatchBlocks
              })}
              activeClassName="is-active"
              onClick={() => {
                SetActive(!active)
              }}
              to="/blocks"
            >
              {$t('common_blockchain')}
            </NavLink>
            <NavLink
              className={classnames('navbar-item is-tab', {
                'is-active': isMatchValidators
              })}
              activeClassName="is-active"
              onClick={() => {
                SetActive(!active)
              }}
              to="/validators"
            >
              {$t('validators')}
            </NavLink>
            <NavLink
              className={classnames('navbar-item is-tab', {
                'is-active': isMatchCrossBlocks
              })}
              activeClassName="is-active"
              onClick={() => {
                SetActive(!active)
              }}
              to="/crossblocks"
            >
              {$t('cross_block')}
            </NavLink>
            <NavLink
              className="navbar-item is-tab"
              activeClassName="is-active"
              onClick={() => {
                SetActive(!active)
              }}
              to="/dex"
            >
              {$t('dex_section')}
            </NavLink>
            <a
                className="navbar-item is-tab has-dropdown is-hoverable"
                style={{alignItems: 'center'}}
            >
              工具
              <div className="navbar-dropdown">
                <NavLink className="navbar-item" to="/ss58" style={{color:'black'}}>
                  ss58账号转换
                </NavLink>
              </div>
            </a>
          </div>
          <NavLink to="/search" style={{display:'flex',flexDirection:'column-reverse', fontSize:'1px',color:'#3f3f3f'}}>
            .
          </NavLink>
          <div className="navbar-end is-hidden-touch is-hidden-tablet-only">
            <InputSearch {...props} />
          </div>
        </div>
      </div>
    </nav>
  )
})
