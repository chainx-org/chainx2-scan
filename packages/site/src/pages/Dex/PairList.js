import React from 'react'
import $t from '@src/locale'
import { useSelector } from 'react-redux'
import { activePairSelector, pairsSelector } from '@src/store/reducers/dexSlice'

import classnames from 'classnames'

export default function PairList() {
  const pairs = useSelector(pairsSelector)
  const active = useSelector(activePairSelector)

  return (
    <section className="panel">
      <div className="panel-heading">{$t('dex_pair')}</div>
      <div className="panel-block pairs" style={{ minHeight: 365 }}>
        <div className="pairs-items">
          {pairs.map(pair => {
            const {
              currencyPair: { base, quote }
            } = pair
            return (
              <div className={classnames('pairs-item', 'active')}>PCX/BTC</div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
