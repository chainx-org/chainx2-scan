import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  fetchCrossWithdrawals,
  crossWithdrawalsSelector
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

export default function CrossWithdrawals({ address }) {
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(20)
  const [loading, setLoading] = useState(false)

  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(fetchCrossWithdrawals(setLoading, page - 1, pageSize))
  }, [dispatch, page, pageSize])

  const { items = [], total } = useSelector(crossWithdrawalsSelector) || {}

  return (
    <Table
      onChange={({ current, pageSize: size }) => {
        setPage(current)
        setPageSize(size)
      }}
      pagination={{ current: page, pageSize, total }}
      dataSource={items.map(item => {
        const btcHashForExplorer = swapEndian(item.btcHash.slice(2))
        const btcTxHashForExplorer = swapEndian(item.btcTxHash.slice(2))
        return {
          key: item._id,
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
          tx_balance: (
            <Amount value={item.balance} precision={8} symbol={'BTC'} />
          ),
          chainx_ex_hash: (
            <TxLink
              style={{ width: 138 }}
              className="text-truncate"
              value={item.chainxExtrinsicHash}
            />
          ),
          chainx_account_id: (
            <AddressLink
              style={{ width: 138 }}
              className="text-truncate"
              value={item.txData[1]}
            />
          ),
          asset_type: 'BTC',
          chainx_time: <DateShow value={item.chainxTime} />
        }
      })}
      columns={[
        {
          title: $t('chainx_ex_hash'),
          dataIndex: 'chainx_ex_hash'
        },
        {
          title: $t('chainx_withdraw_account_id'),
          dataIndex: 'chainx_account_id'
        },
        {
          title: $t('cross_btc_tx_hash'),
          dataIndex: 'btc_tx_hash'
        },
        {
          title: $t('btc_withdraw_address'),
          dataIndex: 'btc_hash'
        },
        {
          title: $t('chainx_withdraw_time'),
          dataIndex: 'chainx_time'
        },
        {
          title: $t('cross_withdraw_asset'),
          dataIndex: 'asset_type'
        },
        {
          title: $t('tx_balance'),
          dataIndex: 'tx_balance'
        },
        {
          title: $t('withdraw_state'),
          dataIndex: 'state'
        }
      ]}
    />
  )
}
