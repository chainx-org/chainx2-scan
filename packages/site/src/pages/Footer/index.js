import React, { useState, useEffect } from 'react'

import weixin from '../../assets/weixin.jpg'
import classnames from 'classnames'
import { FormattedMessage } from 'react-intl'
import { useRedux } from '../../shared'
import { ReactComponent as Up } from '../../assets/open.svg'

export const LangChanger = function() {
  const languages = ['中文', 'English']
  const [{ local }, setLocal] = useRedux('locale')

  let activeLang = languages[0]

  if (!!local) {
    if (local === 'zh-CN') {
      activeLang = '中文'
    } else {
      activeLang = 'English'
    }
  }

  const [language, setLanguage] = useState(activeLang)
  const [active, setActive] = useState(false)

  const handleChange = language => {
    setLanguage(language)
    if (language === '中文') {
      localStorage.setItem('locale', 'zh-CN')
      setLocal({ local: 'zh-CN' })
    } else {
      localStorage.setItem('locale', 'en')
      setLocal({ local: 'en' })
    }
    setActive(false)
  }

  const setNagtive = e => {
    if (e.toElement.className !== 'show-lang') setActive(false)
  }

  useEffect(() => {
    document.body.addEventListener('click', setNagtive)
    return () => document.body.removeEventListener('click', setNagtive)
  })

  return (
    <div className="lang-selector">
      <div className="show-lang" onClick={() => setActive(!active)}>
        {language} <Up className={classnames('select-arrow', { active })} />
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

export default function Footer() {
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
              ChainX
              <FormattedMessage id="HOME" />
            </a>
          </li>
          <li>
            <a
              href="https://wallet.chainx.org"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FormattedMessage id="WALLET" />
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
            WeChat
            <div className="chainx-code">
              <img src={weixin} alt="" />
            </div>
          </li>
          <li>
            <a href="mailto:hi@chainx.org">hi@chainx.org</a>
          </li>
        </ul>
        <div className="footer-end">
          <LangChanger />
          Copyright © 2020 ChainX
        </div>
      </div>
    </div>
  )
}
