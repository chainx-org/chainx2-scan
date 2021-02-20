import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import weixin from '../../assets/weixin.jpg'
import classnames from 'classnames'
import { ReactComponent as Up } from '../../assets/open.svg'
import $t from '../../locale'
import { changeLocale, localeSelector } from '@src/store/reducers/settingsSlice'

export const LangChanger = function() {
  const languages = ['中文', 'English']
  let activeLanguageIndex = 0
  const [active, setActive] = useState(false)

  const dispatch = useDispatch()

  const handleChange = language => {
    if (language === '中文') {
      dispatch(changeLocale('zh'))
    } else {
      dispatch(changeLocale('en'))
    }
    setActive(false)
  }

  const setNagtive = e => {
    if (e.toElement) {
      if (e.toElement.className !== 'show-lang') setActive(false)
    }
  }

  activeLanguageIndex = useSelector(localeSelector) === 'zh' ? 0 : 1

  useEffect(() => {
    document.body.addEventListener('click', setNagtive)
    return () => document.body.removeEventListener('click', setNagtive)
  })

  return (
    <div className="lang-selector">
      <div className="show-lang" onClick={() => setActive(!active)}>
        {languages[activeLanguageIndex]}{' '}
        <Up className={classnames('select-arrow', { active })} />
      </div>
      <ul className={classnames('selector', { active })}>
        {languages.map(item => (
          <li
            className={classnames('select-item')}
            onClick={() => handleChange(item)}
            key={item}
          >
            {item}
          </li>
        ))}
      </ul>
    </div>
  )
}
const width = document.documentElement.clientWidth
export default function Footer() {
  if (width > 768) {
    return (
      <div className="page-footer">
        <div className="container">
          <ul className="footer-start">
            <li>
              <a
                href="https://chainx.org"
                target="_blank"
                rel="noopener noreferrer"
              >
                ChainX{$t('common_home')}
              </a>
            </li>
            <li>
              <a
                href="https://dapp-v2.chainx.org"
                target="_blank"
                rel="noopener noreferrer"
              >
                {$t('common_wallet')}
              </a>
            </li>
            <li>
              <a
                href="https://twitter.com/chainx_org"
                target="_blank"
                rel="noopener noreferrer"
              >
                Twitter
              </a>
            </li>
            <li>
              <a
                href="https://github.com/chainx-org/ChainX"
                target="_blank"
                rel="noopener noreferrer"
              >
                GitHub
              </a>
            </li>
            <li>
              <a
                href="https://t.me/chainx_org"
                target="_blank"
                rel="noopener noreferrer"
              >
                Telegram
              </a>
            </li>
            <li className="chainx-code-wrapper">
              {$t('WeChat')}
              <div className="chainx-code">
                <img src={weixin} alt="" />
              </div>
            </li>
            <li>
              <a href="mailto:hi@chainx.org">hi@chainx.org</a>
            </li>
            <li>
              <div className="footer-end">
                <LangChanger />
                Copyright © 2020 ChainX
              </div>
            </li>
          </ul>
        </div>
      </div>
    )
  } else {
    return (
      <div className="page-footer" style={{ height: '100px' }}>
        <div className="container">
          <ul
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'center',
              justifyContent: 'center',
              paddingTop: '10px'
            }}
          >
            <li>
              <a
                href="https://chainx.org"
                target="_blank"
                rel="noopener noreferrer"
              >
                ChainX{$t('common_home')}
              </a>
            </li>
            <li>
              <a
                href="https://dapp-v2.chainx.org"
                target="_blank"
                rel="noopener noreferrer"
              >
                {$t('common_wallet')}
              </a>
            </li>
            <li>
              <a
                href="https://twitter.com/chainx_org"
                target="_blank"
                rel="noopener noreferrer"
              >
                Twitter
              </a>
            </li>
            <li>
              <a
                href="https://github.com/chainx-org/ChainX"
                target="_blank"
                rel="noopener noreferrer"
              >
                GitHub
              </a>
            </li>
            <li>
              <a
                href="https://t.me/chainx_org"
                target="_blank"
                rel="noopener noreferrer"
              >
                Telegram
              </a>
            </li>
            <li className="chainx-code-wrapper">
              {$t('WeChat')}
              <div className="chainx-code">
                <img src={weixin} alt="" />
              </div>
            </li>
            <li
              style={{
                marginTop: '10px',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                marginLeft: '6vh'
              }}
            >
              <a href="mailto:hi@chainx.org" style={{ marginRight: '15px' }}>
                hi@chainx.org
              </a>
              <LangChanger />
            </li>
            <div
              style={{
                paddingTop: '10px',
                paddingBottom: '10px',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center'
              }}
            >
              Copyright © 2020 ChainX
            </div>
          </ul>
        </div>
      </div>
    )
  }
}
