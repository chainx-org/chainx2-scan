import React, { useEffect, useState } from 'react'
import { NavLink } from 'react-router-dom'
import {
  DateShow,
  ExternalLink,
  Amount,
  NumberFormat,
  TxLink,
  AntSpinner as Spinner
} from '../../components'
import Bitcoin from '../../assets/tokens/btc.png'
import { ReactComponent as Right } from '../../assets/right.svg'
import { FormattedMessage } from 'react-intl'
import $t from '../../locale'
import { useDispatch, useSelector } from 'react-redux'
import {
  crossBlocksSelector,
  crossTransactionsDepositedSelector,
  crossTransactionsWithdrawl,
  crossTransactionsWithdrawlSelector,
  fetchBitCoinTransitbridgeDeposited,
  fetchBitCoinTransitbridgeWithdrawl,
  fetchBtcAddress,
  fetchCrossBlocks,
  fetchBitCoinAddress,
  crossBtcAddressSelector
} from '../../store/reducers/crossBlocksSlice'
import { latestExtrinsicsSelector } from '../../store/reducers/latestExtrinsicSlice'
import Hash from '../../components/Hash'
import SeeAll from './SeeAll'
import AddressLink from '../../components/AddressLink'
import { timeout } from 'rxjs/operators'

export default function BtcStates() {
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(20)
  const [loading, setLoading] = useState(false)

  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(fetchBitCoinTransitbridgeDeposited(setLoading, page - 1, pageSize))
  }, [dispatch, page, pageSize])
  const { total } = useSelector(crossTransactionsDepositedSelector)

  useEffect(() => {
    dispatch(fetchBitCoinTransitbridgeWithdrawl(setLoading, page - 1, pageSize))
  }, [dispatch, page, pageSize])
  const { sum } = useSelector(crossTransactionsWithdrawlSelector) || {}

  useEffect(() => {
    dispatch(fetchBitCoinAddress(setLoading, page - 1, pageSize))
  }, [dispatch, page, pageSize])
  const datas = useSelector(crossBtcAddressSelector)
  if (datas.trusteeListInfoJSON) {
    var coldaddress = datas.trusteeListInfoJSON.coldAddress.addr
    var hotaddress = datas.trusteeListInfoJSON.hotAddress.addr
  }
  const extrinsics = useSelector(latestExtrinsicsSelector)
  const [status, setList] = useState({})

  return (
      <section
        className="panel"
        // style={{ width: 417, marginRight: 16, marginBottom: 0, padding: 0 }}
      >
        <div className="panel-heading">
          <img src={Bitcoin} alt="Bitcoin" className="panel-heading-icon" />
          {$t('bitcoin_bridge')}
        </div>
        <div className="panel-block">
        {false ? (
          <div style={{ minHeight: 250, display: 'flex', width: '100%' }}>
            <Spinner />
          </div>
        ) : (
          <div className="btc_block" style={{ minHeight: 250, display: 'flex', width: '100%' }}>
            <div className="btc_status">
              <div className="btc_title">{$t('multsighot_address')}</div>
              <div className="btc_content">
                <ExternalLink
                  value={hotaddress}
                  type="btcTestnetAddress"
                  render={() => {
                    return (
                      <Hash
                        style={{ width: 138 }}
                        className="text-truncate"
                        value={hotaddress}
                      />
                    )
                  }}
                />
              </div>
            </div>
            <div className="btc_status">
              <div className="btc_title">{$t('multsigcold_address')}</div>
              <div className="btc_content">
                <ExternalLink
                  value={coldaddress}
                  type="btcTestnetAddress"
                  render={() => {
                    return (
                      <Hash
                        style={{ width: 138 }}
                        className="text-truncate"
                        value={coldaddress}
                      />
                    )
                  }}
                />
              </div>
            </div>
            <div className="btc_status">
              <div className="btc_title">{$t('deposit_txs')}</div>
              <div className="btc_content">
                <NavLink to="/crossblocks/bitcoin/deposits">{0}</NavLink>
              </div>
            </div>
            <div className="btc_status">
              <div className="btc_title">{$t('withdrawal_txs')}</div>
              <div className="btc_content">
                <NavLink to="/crossblocks/bitcoin/withdrawals">{0}</NavLink>
              </div>
            </div>
          </div>
        )}
        </div>
      </section>
  )
}
