import React from 'react'
import $t from '@src/locale'
import { useSelector } from 'react-redux'
import { activePairSelector, pairsSelector } from '@src/store/reducers/dexSlice'
import PCX from '../../assets/tokens/pcx_circle.jpg'

import classnames from 'classnames'
import TokenName from '@src/pages/Dex/TokenName'

const tokenImgs = [PCX]

export default function PairList() {
  const pairs = useSelector(pairsSelector)
  const active = useSelector(activePairSelector)

  return (
    <section className="panel">
      <div className="panel-heading" style={{ border: '1px solid #dbdbdb' }}>
        {$t('dex_pair')}
      </div>
      <div className="panel-block pairs" style={{ minHeight: 365 }}>
        <div className="pairs-items">
          {pairs.map((pair, idx) => {
            const {
              currencyPair: { base, quote }
            } = pair
            const currencyImg = tokenImgs[base]

            return (
              <div key={idx} className={classnames('pairs-item', 'active')}>
                {currencyImg && (
                  <img
                    src={currencyImg}
                    className="pairs-item-icon"
                    alt={base}
                  />
                )}
                <TokenName id={base} />/<TokenName id={quote} />
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
