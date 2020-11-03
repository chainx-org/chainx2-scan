import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  fetchCrossTransactions,
  crossTransactionsSelector
} from '@src/store/reducers/crossBlocksSlice'
import Table from '@components/Table'
import Amount from '@components/Amount'
import $t from '@src/locale'
import AddressLink from '@components/AddressLink'
import AccountLink from '@components/AccountLink'
import TxLink from '@components/TxLink'
import TxType from '@components/TxType'
import BlockLink from '@components/BlockLink'
import DateShow from '@components/DateShow'
import ExternalLink from '@components/ExternalLink'
import NumberFormat from '@components/NumberFormat'
import Hash from '@components/Hash'

import swapEndian from '../../../utils/swapEndian'

export default function CrossBtcTx({ address }) {
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(20)
  const [loading, setLoading] = useState(false)

  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(fetchCrossTransactions(setLoading, page - 1, pageSize))
  }, [dispatch, page, pageSize])

  const { items = [], total } = useSelector(crossTransactionsSelector) || {}

  return (
    <Table
      loading={loading}
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
          tx_type: <TxType value={item.txType} />,

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
          chainx_signer: (
            <AccountLink
              style={{ width: 138 }}
              className="text-truncate"
              value={item.signer}
            />
          ),
          chainx_time: <DateShow value={item.chainxTime} />
        }
      })}
      columns={[
        {
          title: $t('cross_block_hash'),
          dataIndex: 'btc_hash'
        },
        {
          title: $t('cross_btc_tx_hash'),
          dataIndex: 'btc_tx_hash'
        },
        {
          title: $t('tx_type'),
          dataIndex: 'tx_type'
        },
        {
          title: $t('tx_balance'),
          dataIndex: 'tx_balance'
        },
        {
          title: $t('chainx_relay_transaction_hash'),
          dataIndex: 'chainx_ex_hash'
        },
        {
          title: $t('chainx_relay_transactioner'),
          dataIndex: 'chainx_signer'
        },
        {
          title: $t('chainx_relay_transaction_time'),
          dataIndex: 'chainx_time'
        }
      ]}
    />
  )
}
