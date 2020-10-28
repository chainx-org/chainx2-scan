import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  fetchCrossDeposits,
  crossDepositsSelector
} from '@src/store/reducers/crossBlocksSlice'
import Table from '@components/Table'
import Amount from '@components/Amount'
import $t from '@src/locale'
import AddressLink from '@components/AddressLink'
import TxLink from '@components/TxLink'
import TxType from '@components/TxType'
import BlockLink from '@components/BlockLink'
import DateShow from '@components/DateShow'
import ExternalLink from '@components/ExternalLink'
import NumberFormat from '@components/NumberFormat'
import Hash from '@components/Hash'

import swapEndian from '../../../utils/swapEndian'

export default function CrossDeposits({ address }) {
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(20)
  const [loading, setLoading] = useState(false)

  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(fetchCrossDeposits(setLoading, page - 1, pageSize))
  }, [dispatch, page, pageSize])

  const { items = [], total } = useSelector(crossDepositsSelector) || {}

  return (
    <Table
      loading={loading}
      onChange={({ current, pageSize: size }) => {
        setPage(current)
        setPageSize(size)
      }}
      pagination={{ current: page, pageSize, total }}
      dataSource={items.map(item => {
        // const btcHashForExplorer = swapEndian(item.btcHash.slice(2))
        const btcTxHashForExplorer = swapEndian(item.data[0].slice(2))
        return {
          key: item._id,
          /*
          id: item.btcHash,
          btc_hash: (
            <ExternalLink
              type="btcTestnetHash"
              value={btcHashForExplorer}
              render={() => {
                return (
                  <Hash
                    style={{ width: 138 }}
                    className="text-truncate"
                    value={btcHashForExplorer}
                  />
                )
              }}
            />
          ),
          */
          btc_tx_hash: (
            <ExternalLink
              type="btcTestnetTxid"
              value={btcTxHashForExplorer}
              render={() => {
                return (
                  <Hash
                    style={{ width: 138 }}
                    className="text-truncate"
                    value={btcTxHashForExplorer}
                  />
                )
              }}
            />
          ),
          // tx_type: <TxType value={item.txType} />,

          tx_balance: (
            <Amount
              value={item.data[2]}
              precision={8}
              symbol={'BTC'}
              hideSymbol
            />
          ),
          chainx_ex_hash: (
            <TxLink
              style={{ width: 138 }}
              className="text-truncate"
              value={item.extrinsicHash}
            />
          ),
          chainx_account_id: item.data ? (
            <AddressLink
              style={{ width: 138 }}
              className="text-truncate"
              value={item.data[1]}
            />
          ) : (
            ''
          ),
          asset_type: 'BTC',
          chainx_time: <DateShow value={item.indexer.blockTime} />
        }
      })}
      columns={[
        /*
        {
          title: $t('cross_block_hash'),
          dataIndex: 'btc_hash'
        },
        */
        {
          title: $t('cross_btc_tx_hash'),
          dataIndex: 'btc_tx_hash'
        },
        /*
        {
          title: $t('tx_type'),
          dataIndex: 'tx_type'
        },
        */
        {
          title: $t('chainx_ex_hash'),
          dataIndex: 'chainx_ex_hash'
        },
        {
          title: $t('chainx_deposit_account_id'),
          dataIndex: 'chainx_account_id'
        },
        {
          title: $t('chainx_deposit_time'),
          dataIndex: 'chainx_time'
        },
        {
          title: $t('cross_deposit_asset'),
          dataIndex: 'asset_type'
        },
        {
          title: $t('tx_balance'),
          dataIndex: 'tx_balance'
        }
      ]}
    />
  )
}
