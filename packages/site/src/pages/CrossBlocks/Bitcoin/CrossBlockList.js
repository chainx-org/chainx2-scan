import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  fetchCrossBlocks,
  crossBlocksSelector
} from '@src/store/reducers/crossBlocksSlice'
import Table from '@components/Table'
import Amount from '@components/Amount'
import $t from '@src/locale'
import AddressLink from '@components/AddressLink'
import TxLink from '@components/TxLink'
import BlockLink from '@components/BlockLink'
import DateShow from '@components/DateShow'
import ExternalLink from '@components/ExternalLink'
import NumberFormat from '@components/NumberFormat'
import Hash from '@components/Hash'

import swapEndian from '../../../utils/swapEndian'

export default function CrossBlocksList({ address }) {
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(20)
  const [loading, setLoading] = useState(false)

  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(fetchCrossBlocks(setLoading, page - 1, pageSize))
  }, [dispatch, page, pageSize])

  const { items = [], total } = useSelector(crossBlocksSelector) || {}

  return (
    <Table
      onChange={({ current, pageSize: size }) => {
        setPage(current)
        setPageSize(size)
      }}
      pagination={{ current: page, pageSize, total }}
      dataSource={items.map(item => {
        // const currentPair = pairs.find(item => item.pairId === fill.pairId)
        // const { pipDecimals = 0, tickDecimals = 0 } = currentPair || {}
        const btcHashForExplorer = swapEndian(item.btcHash.slice(2))
        return {
          key: item._id,
          id: item.btcHash,
          btc_height: (
            <ExternalLink
              type="btcTestnetHash"
              value={item.btcHeight}
              render={() => {
                return <NumberFormat value={item.btcHeight} />
              }}
            />
          ),
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
          chainx_ex_hash: (
            <TxLink
              style={{ width: 138 }}
              className="text-truncate"
              value={item.chainxExtrinsicHash}
            />
          ),
          chainx_signer: (
            <AddressLink
              style={{ width: 138 }}
              className="text-truncate"
              value={item.signer}
            />
          ),
          chainx_time: <DateShow value={item.chainxTime} />
          /*
          extrinsicNum: (item.extrinsics || []).length,
          */

          /*
          key: fill.tradingHistoryIdx,
          id: fill.tradingHistoryIdx,
          price: (
            <Amount
              value={fill.price}
              precision={pipDecimals}
              minDigits={pipDecimals - tickDecimals}
              symbol={'PCX'}
              hideSymbol
            />
          ),
          amount: <Amount value={fill.turnover} symbol={'PCX'} hideSymbol />,
          maker: (
            <AddressLink
              style={{ maxWidth: 136 }}
              className="text-truncate"
              value={fill.maker}
            />
          ),
          taker: (
            <AddressLink
              style={{ maxWidth: 136 }}
              className="text-truncate"
              value={fill.taker}
            />
          ),
          maker_user_order_index: fill.makerOrderId,
          taker_user_order_index: fill.takerOrderId,
          createTime: <DateShow value={fill.blockTime} />
          */
        }
      })}
      columns={[
        {
          title: $t('cross_block_height'),
          dataIndex: 'btc_height'
        },
        {
          title: $t('cross_block_hash'),
          dataIndex: 'btc_hash'
        },
        /*
        {
          title: $t('cross_block_time'),
          dataIndex: 'timestamp'
        },
        {
          title: $t('nonce'),
          dataIndex: 'nonce'
        },
        {
          title: $t('cross_block_transaction_amount'),
          dataIndex: 'transactionAmount'
        },
        */
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
        /*
        {
          title: <>ID</>,
          dataIndex: 'id'
        },
        {
          title: <>{$t('dex_price')}</>,
          dataIndex: 'price'
        },
        {
          title: <>{$t('dex_fill_amount')}</>,
          dataIndex: 'amount'
        },
        {
          title: <>{$t('dex_maker_account')}</>,
          dataIndex: 'maker'
        },
        {
          title: $t('dex_maker_order_id'),
          dataIndex: 'maker_user_order_index'
        },
        {
          title: <>{$t('dex_taker_account')}</>,
          dataIndex: 'taker'
        },
        {
          title: $t('dex_taker_order_id'),
          dataIndex: 'taker_user_order_index'
        },
        {
          title: $t('common_time'),
          dataIndex: 'createTime'
        }
        */
      ]}
    />
  )
}
