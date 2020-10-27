import api from '../../services/api'
import { useLoad } from '../../utils/hooks'

import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  fetchUnsettledNodes,
  unsettledNodesSelector
} from '@src/store/reducers/validatorsSlice'
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

export default function() {
  // const { items: blocks, loading, total } = useLoad(api.fetchBlocks, params)

  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(20)
  const [loading, setLoading] = useState(false)

  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(fetchUnsettledNodes(setLoading, page - 1, pageSize))
  }, [dispatch, page, pageSize])

  const { items = [], total } = useSelector(unsettledNodesSelector) || {}

  return (
    <Table
      loading={loading}
      onChange={({ current, pageSize: size }) => {
        setPage(current)
        setPageSize(size)
      }}
      pagination={{ current: page, pageSize, total }}
      dataSource={items.map(item => {
        return {
          account_address: (
            <AddressLink
              style={{ width: 138 }}
              className="text-truncate"
              value={item.account}
            />
          ),
          number: <BlockLink value={item.selfBonded} />,
          registered_block_height: (
            <BlockLink
              style={{ width: 138 }}
              className="text-truncate"
              value={item.registeredAt}
            />
          ),
          timestamp: <DateShow value={item.registeredAt} />,
          key: item._id,
          reward_pot_address: (
            <AddressLink
              style={{ width: 138 }}
              className="text-truncate"
              value={item.rewardPotAccount}
            />
          ),
          registeredAt: item.registeredAt,
          self_bonded: (
            <Amount
              value={item.selfBonded}
              precision={8}
              symbol={'PCX'}
              hideSymbol
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
          nominations_last_update: (
            <BlockLink
              style={{ width: 138 }}
              className="text-truncate"
              value={item.lastTotalVoteWeightUpdate}
            />
          ),
          total_weight: (
            <Amount value={item.lastTotalVoteWeight} precision={8} hideSymbol />
          )
        }
      })}
      columns={[
        {
          title: $t('address_item'),
          dataIndex: 'account_address'
        },
        {
          title: $t('registered_block_height'),
          dataIndex: 'registered_block_height'
        },
        {
          title: $t('self_bonded'),
          dataIndex: 'self_bonded'
        },
        {
          title: $t('total_nominations'),
          dataIndex: 'total_weight'
        },
        {
          title: $t('reward_pot_balance'),
          dataIndex: 'reward_pot_balance'
        },
        {
          title: $t('reward_pot_address'),
          dataIndex: 'reward_pot_address'
        },
        {
          title: $t('total_nomination_last_update'),
          dataIndex: 'nominations_last_update'
        }
      ]}
    />
  )
}
