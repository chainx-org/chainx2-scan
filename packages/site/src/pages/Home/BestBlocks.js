import React, { useEffect } from 'react'
import { NavLink } from 'react-router-dom'
import $t from '../../locale'
import {
  BlockLink,
  NumberFormat,
  AntSpinner as Spinner,
  ValidatorLink
} from '../../components'
import { useRedux } from '../../shared'
import api from '../../services/api'
import { ReactComponent as Right } from '../../assets/right.svg'
import { FormattedMessage } from 'react-intl'

export default function BestBlocks() {
  const [{ blocks }, setState] = useRedux('bestBlocks', { blocks: [] })

  useEffect(() => {
    const subscription = api
      .fetchLatestBlocks$()
      .subscribe(data => setState({ blocks: data }))
    return () => subscription.unsubscribe()
  }, [api])

  const loading = (
    <tr style={{ height: 222, background: '#fff' }}>
      <td colSpan="3" style={{ verticalAlign: 'middle' }}>
        <Spinner />
      </td>
    </tr>
  )

  return (
    <section className="panel">
      <div className="panel-heading">{$t('block_latest_blocks')}</div>
      <div className="panel-block">
        <table className="table is-striped is-fullwidth data-table">
          <thead>
            <tr>
              <th>{$t('block_height')}</th>
              <th>{$t('common_validator')}</th>
              <th className="has-text-right">{$t('block_extrinsic_num')}</th>
            </tr>
          </thead>
          <tbody>
            {blocks && blocks.length
              ? blocks.slice(0, 6).map(({ number, producer, extrinsics }) => (
                  <tr key={number}>
                    <td>
                      <BlockLink value={number} />
                    </td>
                    <td>
                      <ValidatorLink value={producer} />
                    </td>
                    <td className="has-text-right">
                      <NumberFormat value={extrinsics} />
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
        <NavLink className="view-more" to="/blocks">
          {$t('see_all')}
          <Right className="right" />
        </NavLink>
      </div>
    </section>
  )
}
