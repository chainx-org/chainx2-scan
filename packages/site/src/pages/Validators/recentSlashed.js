import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Table from '@components/Table'
import $t from '@src/locale'
import AccountLink from '@components/AccountLink'
import AddressLink from '@components/AddressLink'
import DateShow from '@components/DateShow'
import BlockLink from '@components/BlockLink'
import ValidatorLink from '@components/ValidatorLink'
import Amount from '@components/Amount'
import {
  fetchRecentSlashed,
  RecentSlashedSelector
} from '../../store/reducers/validatorsSlice'

export default function() {
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(20)
  const [loading, setLoading] = useState(false)

  const width = document.documentElement.clientWidth
  const simple = width < 1024

  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(fetchRecentSlashed(setLoading, page - 1, pageSize))
  }, [dispatch, page, pageSize])

  const { items = [], total } = useSelector(RecentSlashedSelector) || {}

  return (
    <Table
      loading={loading}
      onChange={({ current, pageSize: size }) => {
        setPage(current)
        setPageSize(size)
      }}
      pagination={{ current: page, pageSize, total, simple }}
      scroll={{
        x: '100vh'
      }}
      dataSource={items.map(item => {
        return {
          key: item._id,
          blockHeight: <BlockLink value={item.indexer.blockHeight} />,
          blockTime: <DateShow value={item.indexer.blockTime} />,
          validator_name: (
            <ValidatorLink
              name={item.referralId}
              style={{ width: 138 }}
              className="text-truncate"
              value={item.data[0]}
            />
          ),
          validator_address: (
            <AccountLink
              style={{ width: 138 }}
              className="text-truncate"
              value={item.data[0]}
            />
          ),
          slashAmount: (
            <Amount value={item.data[1]} precision={8} symbol={'PCX'} />
          )
        }
      })}
      columns={[
        {
          title: $t('block_height'),
          dataIndex: 'blockHeight'
        },
        {
          title: $t('block_time'),
          dataIndex: 'blockTime'
        },
        {
          title: $t('validator_address'),
          dataIndex: 'validator_address'
        },
        {
          title: $t('referral_id'),
          dataIndex: 'validator_name'
        },
        {
          title: $t('slash_amount'),
          dataIndex: 'slashAmount'
        }
      ]}
    />
  )
}
