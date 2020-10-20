import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  fetchCrossBlocks,
  crossBlocksSelector
} from '@src/store/reducers/crossBlocksSlice'
import Table from '@components/Table'
import Amount from '@components/Amount'
import TokenName from '@components/TokenName'
import $t from '@src/locale'
import AddressLink from '@components/AddressLink'
import TxLink from '@components/TxLink'
import BlockLink from '@components/BlockLink'
import DateShow from '@components/DateShow'
import ExternalLink from '@components/ExternalLink'
import NumberFormat from '@components/NumberFormat'
import Hash from '@components/Hash'

import swapEndian from '../../utils/swapEndian'

export default function DepositMine({ address }) {
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(20)
  const [loading, setLoading] = useState(false)

  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(fetchCrossBlocks(setLoading, page - 1, pageSize))
  }, [dispatch, page, pageSize])

  const { items = [], total } = useSelector(crossBlocksSelector) || {}

  return (
    <div className="box">
      <Table
        onChange={({ current, pageSize: size }) => {
          setPage(current)
          setPageSize(size)
        }}
        pagination={false}
        dataSource={items.slice(0, 1).map(item => {
          // const currentPair = pairs.find(item => item.pairId === fill.pairId)
          // const { pipDecimals = 0, tickDecimals = 0 } = currentPair || {}
          const btcHashForExplorer = swapEndian(item.btcHash.slice(2))
          const token_name = 'BTC'
          const chain_total_balance = 38040535172
          const mining_power = 40000000000
          const equivalent_nominations = 15216214068800
          const jackpot_balance = 345395934785
          const jackpot_last_update = 20714785
          const total_weight = 23948680515905810
          return {
            key: item._id,
            id: item.btcHash,
            asset_type: 'Interchain BTC(X-BTC)',
            // asset_type: <TokenName value={token_name} id={1}/>,
            chain_total_balance: (
              <Amount
                value={chain_total_balance}
                precision={8}
                symbol={'BTC'}
                hideSymbol
              />
            ),
            mining_power: (
              <Amount
                value={mining_power}
                precision={8}
                symbol={'BTC'}
                hideSymbol
              />
            ),
            equivalent_nominations: (
              <Amount
                value={equivalent_nominations}
                precision={8}
                symbol={'BTC'}
                hideSymbol
              />
            ),
            jackpot_balance: (
              <Amount
                value={jackpot_balance}
                precision={8}
                symbol={'BTC'}
                hideSymbol
              />
            ),
            jackpot_last_update: (
              <Amount value={jackpot_last_update} precision={0} hideSymbol />
            ),
            total_weight: (
              <Amount value={total_weight} precision={8} hideSymbol />
            )
          }
        })}
        columns={[
          {
            title: $t('asset_type'),
            dataIndex: 'asset_type'
          },
          {
            title: $t('chain_total_balance'),
            dataIndex: 'chain_total_balance'
          },
          {
            title: $t('mining_power'),
            dataIndex: 'mining_power'
          },
          {
            title: $t('equivalent_nominations'),
            dataIndex: 'equivalent_nominations'
          },
          {
            title: $t('jackpot_balance'),
            dataIndex: 'jackpot_balance'
          },
          {
            title: $t('jackpot_last_update'),
            dataIndex: 'jackpot_last_update'
          },
          {
            title: $t('total_weight'),
            dataIndex: 'total_weight'
          }
        ]}
      />
    </div>
  )
}
