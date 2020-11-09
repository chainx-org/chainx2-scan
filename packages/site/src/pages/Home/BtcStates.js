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
  fetchBtcStatus,
  crossBtcStatusSelector
} from '../../store/reducers/crossBlocksSlice'

export default function BtcStates() {
  const [loading, setLoading] = useState(false)
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(fetchBtcStatus(setLoading))
  }, [dispatch])

  const status = useSelector(crossBtcStatusSelector) || {}


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
        {!status.hotAddress ? (
          <div style={{ minHeight: 250, display: 'flex', width: '100%' }}>
            <Spinner />
          </div>
        ) : (
          <div className="btc_block" style={{ minHeight: 250, display: 'flex', width: '100%' }}>
            <div className="btc_status">
              <div className="btc_title">{$t('multsighot_address')}</div>
              <div className="btc_content">
                <ExternalLink
                  value={status.hotAddress ? status.hotAddress.addr : null}
                  type="btcTestnetAddress"
                  style={{ width: 138 }}
                  className="text-truncate"
                />
              </div>
            </div>
            <div className="btc_status">
              <div className="btc_title">{$t('multsigcold_address')}</div>
              <div className="btc_content">
                <ExternalLink
                  value={status.coldAddress ? status.coldAddress.addr : null}
                  type="btcTestnetAddress"
                  style={{ width: 138 }}
                  className="text-truncate"
                />
              </div>
            </div>
            <div className="btc_status">
              <div className="btc_title">{$t('deposit_txs')}</div>
              <div className="btc_content">
                <NavLink to="/crossblocks/bitcoin/deposits">{status.depositCount ? status.depositCount : 0}</NavLink>
              </div>
            </div>
            <div className="btc_status">
              <div className="btc_title">{$t('withdrawal_txs')}</div>
              <div className="btc_content">
                <NavLink to="/crossblocks/bitcoin/withdrawals">{status.withdrawlCount ? status.withdrawalCount : 0}</NavLink>
              </div>
            </div>
          </div>
        )}
        </div>
      </section>
  )
}
