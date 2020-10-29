import React, { useEffect, useState } from 'react'
import { NavLink } from 'react-router-dom'
import $t from '../../locale'
import { useRedux } from '../../shared'
import api from '../../services/api'
import {
  AddressLink,
  DateShow,
  ExternalLink,
  Amount,
  NumberFormat,
  TxLink,
  AntSpinner as Spinner
} from '../../components'
import Hash from '../../components/Hash'
import Bitcoin from '../../assets/tokens/btc.png'
import { ReactComponent as Right } from '../../assets/right.svg'
import { FormattedMessage } from 'react-intl'

export default function BtcStatus() {
  const [{ data }, setState] = useRedux('btcStatus', { data: [] })
  const [status, setList] = useState({})

  useEffect(() => {
    const subscription = api
      .fetchBtcStatus$()
      .subscribe(data => setState({ data }))
    return () => subscription.unsubscribe()
  }, [api])

  useEffect(() => {
    const subscription = api
      .fetchHTTPBtcStatus$()
      .subscribe(status => setList(status))
    return () => subscription.unsubscribe()
  }, [api])

  const loading = (
    <tr style={{ height: 239, background: '#fff' }}>
      <td colSpan="8" style={{ verticalAlign: 'middle' }}>
        <Spinner />
      </td>
    </tr>
  )

  return (
    <div style={{ display: 'flex' }}>
      <div
        className="panel"
        style={{ width: 417, marginRight: 16, marginBottom: 0, padding: 0 }}
      >
        <div className="panel-heading">
          <img src={Bitcoin} alt="Bitcoin" className="panel-heading-icon" />
          <FormattedMessage id="BTCBRIDGE" />
        </div>
        <div className="panel-block align-start">
          {!(data && data.length) ? (
            <div style={{ minHeight: 269, display: 'flex', width: '100%' }}>
              <Spinner />
            </div>
          ) : (
            <div className="btc_block">
              <div className="btc_status">
                <div className="btc_title">
                  <FormattedMessage id="MULTISIGTRUSTEEHOTBALANCE" />
                </div>
                <div className="btc_content">
                  <ExternalLink
                    value={status.hot_address}
                    type="btcAddress"
                    render={() => (
                      <Amount
                        value={status.hot_balance}
                        symbol="BTC"
                        hideSymbol
                      />
                    )}
                  />
                </div>
              </div>
              <div className="btc_status">
                <div className="btc_title">
                  <FormattedMessage id="MULTISIGTRUSTEECOLDBALANCE" />
                </div>
                <div className="btc_content">
                  <ExternalLink
                    value={status.cold_address}
                    type="btcAddress"
                    render={() => (
                      <Amount
                        value={status.cold_balance}
                        symbol="BTC"
                        hideSymbol
                      />
                    )}
                  />
                </div>
              </div>
              <div className="btc_status">
                <div className="btc_title">
                  <FormattedMessage id="lockbtcstatusbalance" />
                </div>
                <div className="btc_content">
                  <NavLink to="/crossblocks/bitcoin/locklist">
                    <Amount
                      value={status.lockup_balance}
                      symbol="BTC"
                      hideSymbol
                    />
                  </NavLink>
                </div>
              </div>
              <div className="btc_status">
                <div className="btc_title">
                  <FormattedMessage id="DEPOSITETRANSACTIONCOUNT" />
                </div>
                <div className="btc_content">
                  <NavLink to="/crossblocks/bitcoin/deposits">
                    {status.deposit_count}
                  </NavLink>
                </div>
              </div>
              <div className="btc_status">
                <div className="btc_title">
                  <FormattedMessage id="LOCKACTIONCOUNT" />
                </div>
                <div className="btc_content">
                  <NavLink to="/crossblocks/bitcoin/locklist">
                    {status.lockup_count}
                  </NavLink>
                </div>
              </div>
              <div className="btc_status">
                <div className="btc_title">
                  <FormattedMessage id="WIDTHDRAWALTRANSACTIONCOUNT" />
                </div>
                <div className="btc_content">
                  <NavLink to="/crossblocks/bitcoin/withdrawals">
                    {status.withdraw_count}
                  </NavLink>
                </div>
              </div>
              <div className="btc_status">
                <div className="btc_title">
                  <FormattedMessage id="跨链充值地址数" />
                </div>
                <div className="btc_content">
                  <NavLink to="/crossblocks/bitcoin/crossbind">
                    {status.bind_count}
                  </NavLink>
                </div>
              </div>
              <div className="btc_status">
                <div className="btc_title">
                  <FormattedMessage id="跨链锁仓地址数" />
                </div>
                <div className="btc_content">
                  <NavLink to="/crossblocks/bitcoin/locklist">
                    {status.lockup_address_count}
                  </NavLink>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      <section className="panel" style={{ flex: 1 }}>
        <div className="panel-heading">
          <FormattedMessage id="转接桥最新区块" />
        </div>
        <div className="panel-block">
          <table className="table is-striped is-fullwidth data-table">
            <thead>
              <tr>
                <th>
                  Bitcoin
                  <FormattedMessage id="HEIGHT" />
                </th>
                <th>
                  Bitcoin
                  <FormattedMessage id="BLOCKHASH" />
                </th>
                <th>
                  ChainX
                  <FormattedMessage id="TRUNKTRANSACTIONHASH" />
                </th>
                <th>
                  ChainX
                  <FormattedMessage id="TRUNKTRANSACTIONER" />
                </th>
                <th>
                  ChainX
                  <FormattedMessage id="TRUNKTRANSACTIONTIME" />
                </th>
              </tr>
            </thead>
            <tbody>
              {data && data.length
                ? data.slice(0, 5).map(btcBlock => (
                    <tr key={btcBlock.bitcoin_height}>
                      <td>
                        <ExternalLink
                          type="btcHash"
                          value={btcBlock.header}
                          render={() => {
                            return (
                              <NumberFormat value={btcBlock.bitcoin_height} />
                            )
                          }}
                        />
                      </td>
                      <td>
                        <ExternalLink
                          type="btcHash"
                          value={btcBlock.header}
                          render={() => {
                            return (
                              <Hash
                                style={{ width: 136 }}
                                className="text-truncate"
                                value={btcBlock.header}
                              />
                            )
                          }}
                        />
                      </td>
                      <td>
                        <TxLink
                          style={{ width: 136 }}
                          className="text-truncate"
                          value={btcBlock.chainx_tx}
                        />
                      </td>
                      <td>
                        <AddressLink
                          style={{ width: 136 }}
                          className="text-truncate"
                          value={btcBlock.relay}
                        />
                      </td>
                      <td>
                        <DateShow value={btcBlock['block.time']} />
                      </td>
                    </tr>
                  ))
                : loading}
            </tbody>
          </table>
        </div>
        <div
          className="panel-block panel-footer-link"
          style={{ justifyContent: 'center' }}
        >
          <NavLink className="view-more" to="/crossblocks">
            <FormattedMessage id="SHOWALL" />
            <Right className="right" />
          </NavLink>
        </div>
      </section>
    </div>
  )
}
