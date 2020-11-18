import React, { useEffect } from 'react'
import $t from '@src/locale'
import { useSelector, useDispatch } from 'react-redux'
import PCX from '../../assets/tokens/pcx_circle.jpg'
import classnames from 'classnames'
import TokenName from '@src/pages/Dex/TokenName'
import {
  fetchFills,
  fetchPairs,
  fetchTradingPairs,
  fillsSelector,
  pairsSelector,
  tradingPairsSelector
} from '../../store/reducers/dexSlice'
import { openOrdersSelector } from '../../store/reducers/accountSlice'
import Amount from '../../components/Amount'

export default function PairList() {
  const dispatch = useDispatch()
  useEffect(() => {
    dispatch(fetchTradingPairs())
  }, [dispatch])
  const Tradingpairs = useSelector(tradingPairsSelector)
  return (
    <section className="panel">
      <div className="panel-heading" style={{ border: '1px solid #dbdbdb' }}>
        {$t('dex_pair')}
      </div>
      <div className="panel-block pairs" style={{ minHeight: 365 }}>
        <div className="pairs-items">
          <div>
            <div className={classnames('pairs-item', 'active')}>
              <img src={PCX} className="pairs-item-icon" />
              <div>PCX/BTC</div>
            </div>
          </div>
        </div>
        <div className={'pairs-content'}>
          <div className={'pairs-content-item'}>
            <div className="pairs-content-item__label">
              {$t('dex_latest_deal')}
            </div>
            <div className="pairs-content-item__value" style={{ fontSize: 24 }}>
              <Amount
                value={Tradingpairs ? Tradingpairs.latestTransactionPrices : 0}
                precision={9}
                symbol={'BTC'}
              />
            </div>
          </div>
          <div className={'pairs-content-item'}>
            <div className="pairs-content-item__label">
              {$t('dex_day_deal_amount')}
            </div>
            <div className="pairs-content-item__value" style={{ fontSize: 24 }}>
              <Amount
                value={Tradingpairs ? Tradingpairs.TransactionsDayNumber : 0}
                precision={8}
                symbol={'PCX'}
              />
            </div>
          </div>
          <div className={'pairs-content-item'}>
            <div className="pairs-content-item__label">
              {$t('dex_week_deal_count')}
            </div>
            <div className="pairs-content-item__value" style={{ fontSize: 24 }}>
              <div>
                {Tradingpairs ? Tradingpairs.TransactionsWeekNumber : 0}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
