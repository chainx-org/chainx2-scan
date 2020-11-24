import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  fetchDepositMine,
  crossDepositMineSelector
} from '@src/store/reducers/crossBlocksSlice'
import Table from '@components/Table'
import Amount from '@components/Amount'
import $t from '@src/locale'
import AddressLink from '@components/AddressLink'
import AccountLink from '../../components/AccountLink'

export default function DepositMine({ address }) {
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(20)
  const [loading, setLoading] = useState(false)

  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(fetchDepositMine(setLoading, page - 1, pageSize))
  }, [dispatch, page, pageSize])

  const { items = [], total } = useSelector(crossDepositMineSelector) || {}
  const width = document.documentElement.clientWidth
  const simple = width < 1024

  return (
    <div className="box">
      <Table
        loading={loading}
        onChange={({ current, pageSize: size }) => {
          setPage(current)
          setPageSize(size)
        }}
        scroll={{
          x: '100vh'
        }}
        pagination={false}
        dataSource={items.map(item => {
          const token_name = ['BTC', 'PCX']
          return {
            key: item._id,
            asset_type: (
              <div style={{ whiteSpace: 'nowrap' }}>
                {'Interchain BTC(X-BTC)'}
              </div>
            ),
            btc_total_balance: (
              <Amount
                value={item.balance.Usable}
                precision={8}
                symbol={'BTC'}
                hideSymbol
              />
            ),
            mining_power: (
              <Amount
                value={item.miningPower}
                precision={0}
                symbol={'PCX'}
                hideSymbol
              />
            ),
            equivalent_nominations: (
              <Amount
                value={item.equivalent_nominations}
                precision={8}
                hideSymbol
              />
            ),
            reward_pot_address: (
              <AccountLink
                style={{ width: 138 }}
                className="text-truncate"
                value={item.rewardPot}
              />
            ),
            reward_pot_balance: (
              <Amount
                value={item.rewardPotBalance}
                precision={8}
                symbol={'PCX'}
                hideSymbol
              />
            ),
            reward_pot_last_update: (
              <Amount
                value={item.lastTotalMiningWeightUpdate}
                precision={0}
                hideSymbol
              />
            ),
            total_weight: (
              <Amount
                value={item.lastTotalMiningWeight}
                precision={8}
                hideSymbol
              />
            )
          }
        })}
        columns={[
          {
            title: $t('asset_type'),
            dataIndex: 'asset_type'
          },
          {
            title: $t('btc_total_balance'),
            dataIndex: 'btc_total_balance'
          },
          {
            title: $t('mining_power'),
            dataIndex: 'mining_power'
          },
          {
            title: $t('reward_pot_address'),
            dataIndex: 'reward_pot_address'
          },
          {
            title: $t('equivalent_nominations'),
            dataIndex: 'equivalent_nominations'
          },
          {
            title: $t('reward_pot_balance'),
            dataIndex: 'reward_pot_balance'
          },
          {
            title: $t('reward_pot_last_update'),
            dataIndex: 'reward_pot_last_update'
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
