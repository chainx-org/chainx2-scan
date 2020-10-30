import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import $t from '../../locale'
import { latestExtrinsicsSelector } from '../../store/reducers/latestExtrinsicSlice'
import TxLink from '../../components/TxLink'
import TxAction from '../../components/TxAction'
import loading from './Loading'
import SeeAll from './SeeAll'
import AddressLink from '@components/AddressLink'
import {
  crossBlocksSelector,
  fetchCrossBlocks
} from '../../store/reducers/crossBlocksSlice'
import ExternalLink from '../../components/ExternalLink'
import NumberFormat from '../../components/NumberFormat'
import Hash from '../../components/Hash'
import DateShow from '../../components/DateShow'
export default function BtcStatus() {
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(20)
  const [loading, setLoading] = useState(false)

  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(fetchCrossBlocks(setLoading, page - 1, pageSize))
  }, [dispatch, page, pageSize])

  const { items = [], total } = useSelector(crossBlocksSelector) || {}
  const extrinsics = useSelector(latestExtrinsicsSelector)
  return (
    <section className="panel">
      <div
        className="panel-heading"
        style={{ borderBottom: '1px solid #dbdbdb' }}
      >
        {$t('bridge_newblocks')}
      </div>
      <div className="panel-block">
        <table className="table is-striped is-fullwidth data-table">
          <thead>
            <tr>
              <th>{$t('cross_block_height')}</th>
              <th>{$t('cross_block_hash')}</th>
              <th>{$t('chainx_relay_transaction_hash')}</th>
              <th>{$t('chainx_relay_transactioner')}</th>
              <th className="has-text-right">
                {$t('chainx_relay_transaction_time')}
              </th>
            </tr>
          </thead>
          <tbody>
            {items && items.length
              ? items
                  .slice(0, 6)
                  .map(
                    ({
                      _id,
                      btcHeight,
                      btcHash,
                      chainxExtrinsicHash,
                      signer,
                      chainxTime
                    }) => {
                      return (
                        <tr key={_id}>
                          <td>
                            <ExternalLink
                              type="btcTestnetHash"
                              style={{ width: 80 }}
                              value={btcHeight}
                              render={() => {
                                return <NumberFormat value={btcHeight} />
                              }}
                            />
                          </td>
                          <td>
                            <ExternalLink
                              type="btcTestnetHash"
                              value={btcHash}
                              render={() => {
                                return (
                                  <Hash
                                    style={{ width: 138 }}
                                    className="text-truncate"
                                    value={btcHash}
                                  />
                                )
                              }}
                            />
                          </td>
                          <td>
                            <TxLink
                              style={{ width: 138 }}
                              className="text-truncate"
                              value={chainxExtrinsicHash}
                            />
                          </td>
                          <td>
                            <AddressLink
                              style={{ width: 138 }}
                              className="text-truncate"
                              value={signer}
                            />
                          </td>
                          <td>
                            <DateShow value={chainxTime} />
                          </td>
                        </tr>
                      )
                    }
                  )
              : loading}
          </tbody>
        </table>
      </div>
      <SeeAll link="/crossblocks" />
    </section>
  )
}
