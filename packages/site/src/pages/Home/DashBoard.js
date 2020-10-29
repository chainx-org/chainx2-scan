import React, { useEffect } from 'react'
import { NavLink } from 'react-router-dom'
import { FormattedMessage } from 'react-intl'
import { useRedux } from '../../shared'
import api from '../../services/api'
import { Amount, NumberFormat, AntSpinner as Spinner } from '../../components'
import PCX from '../../assets/tokens/pcx.png'
import $t from '../../locale'

export default function DashBoard() {
  const [{ data }, setState] = useRedux('dashBoard', { data: {} })

  useEffect(() => {
    const subscription = api
      .fetchChainStatus$()
      .subscribe(result => setState({ data: result }))
    return () => subscription.unsubscribe()
  }, [api])

  const dataSource = [
    {
      label: (
        <div>
          {$t('latest_block')} / {$t('finalized_block')}
        </div>
      ),
      data: (
        <div>
          <NumberFormat value={data.best} /> /{' '}
          <NumberFormat value={data.finalized} />
        </div>
      )
    },
    {
      label: (
        <>
          ChainX
          {$t('total_extrinsics')} / {$t('total_accounts')}
        </>
      ),
      data: (
        <>
          <NumberFormat value={data.transactions} /> /{' '}
          <NumberFormat value={data.account_count} />
        </>
      )
    },
    {
      label: (
        <>
          {$t('contracts_counts')} / {$t('call_counts')}
        </>
      ),
      data: (
        <div>
          <NavLink to={`/contracts`} className="nav-link">
            <NumberFormat value={data.contract_count} />
          </NavLink>{' '}
          / <NumberFormat value={data.contract_call_count} />
        </div>
      )
    },
    {
      label: (
        <div>
          {$t('validators_number')} / {$t('elections')}
        </div>
      ),
      data: (
        <div>
          <NavLink to={`/validators`} className="nav-link">
            <NumberFormat value={data.validators} />
          </NavLink>{' '}
          / <NumberFormat value={data.vote_cycle} />
        </div>
      )
    },
    {
      label: (
        <div>
          {$t('total_issuance')} / {$t('turnout')}
        </div>
      ),
      data: (
        <div>
          <Amount value={data.pcx_issuance} hideSymbol minDigits={0} /> /{' '}
          <NumberFormat
            value={(data.selfvote_count + data.votes) / data.pcx_issuance}
            options={{ style: 'percent', minimumFractionDigits: 2 }}
          />
        </div>
      )
    },
    {
      label: $t('intention_bonded'),
      data: <Amount value={data.selfvote_count} hideSymbol />
    },
    {
      label: $t('use_vote'),
      data: <Amount value={data.votes} hideSymbol />
    },
    {
      label: $t('price'),
      // 写死了精度 9
      data: (
        <Amount
          value={data.last_price}
          hideSymbol
          symbol="BTC"
          precision={9}
          minDigits={7}
        />
      )
    },
    {
      label: (
        <div>
          {$t('btc_mining')} / {$t('sdot_mining')}
        </div>
      ),
      data: (
        <div>
          <Amount value={data.btc_power} hideSymbol /> /{' '}
          <Amount value={data.sdot_power} hideSymbol />
        </div>
      )
    }
  ]

  const loading = (
    <div
      style={{
        height: 176,
        background: '#fff',
        width: '100%',
        display: 'flex'
      }}
    >
      <Spinner />
    </div>
  )

  return (
    <div style={{ display: 'flex' }}>
      <section className="panel" style={{ flex: 1, marginRight: 16 }}>
        <div className="panel-heading">
          <img src={PCX} alt="pcx" className="panel-heading-icon" />
          {$t('chain_status')}
        </div>
        <div
          className="panel-block align-start"
          style={{
            padding: 0,
            borderRight:
              dataSource && data && data.best ? 0 : '1px solid #dbdbdb',
            minHeight: 265
          }}
        >
          <div
            className="columns is-multiline is-gapless"
            style={{ marginBottom: '0', margin: 'auto' }}
          >
            {dataSource && data && data.best
              ? dataSource.map((item, index) => (
                  <div key={index} className="column is-4 dashboard-cell">
                    <div className="dashboard-cell__title">{item.label}</div>
                    <div className="dashboard-cell__content">{item.data}</div>
                  </div>
                ))
              : loading}
          </div>
          {/*<Transaction style={{ width: "40%", height: "265px" }} />*/}
        </div>
      </section>
      <div className="panel" style={{ width: 417, marginBottom: '1.25rem' }}>
        <div className="panel-heading">{$t('power_distributton')}</div>
        <div className="panel-block align-start"></div>
      </div>
    </div>
  )
}
