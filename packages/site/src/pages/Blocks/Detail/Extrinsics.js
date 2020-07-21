import React, { useState } from 'react'
import classnames from 'classnames'
import $t from '../../../locale'
import ExtrinsicList from '../../Extrinsics/List'

export default function({ blockHeight }) {
  const [activeKey, setActiveKey] = useState('extrinsics')

  return (
    <div className="box">
      <div className="tabs">
        <ul>
          <li
            onClick={() => setActiveKey('extrinsics')}
            className={classnames({ 'is-active': activeKey === 'extrinsics' })}
          >
            <a>{$t('ex_list')}</a>
          </li>
        </ul>
      </div>
      {blockHeight && <ExtrinsicList blockHeight={blockHeight} />}
    </div>
  )
}
