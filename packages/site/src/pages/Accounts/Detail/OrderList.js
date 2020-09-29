import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  fetchOpenOrders,
  openOrdersSelector
} from '@src/store/reducers/accountSlice'
import Table from '@components/Table'
import AddressLink from '@components/AddressLink'
import $t from '@src/locale'
import OrderDirection from '@components/OrderDirection'
import Amount from '@components/Amount'
import HasFill from '@components/HasFill'
import OrderStatus from '@components/OrderStatus'

export default function OrderList({ address }) {
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(20)
  const active = null
  const { pipDecimals = 0, tickDecimals = 0 } = active || {}
  const { items: open_orders, total } = useSelector(openOrdersSelector)
  const [loading, setLoading] = useState(false)

  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(fetchOpenOrders(address, setLoading))
  }, [address, dispatch])

  return (
    <Table
      onChange={({ current, pageSize: size }) => {
        setPage(current)
        setPageSize(size)
      }}
      pagination={{ current: page, pageSize, total }}
      dataSource={(open_orders || []).map((data, idx) => {
        const hasFill = data.alreadyFilled

        return {
          accountid: (
            <AddressLink
              style={{ maxWidth: 136 }}
              className="text-truncate"
              value={data.props.submitter}
            />
          ),
          id: data.props.id,
          direction: <OrderDirection value={data.props.side} />,
          price: (
            <Amount
              value={data.props.price}
              precision={pipDecimals}
              minDigits={pipDecimals - tickDecimals}
              symbol={'PCX'}
              hideSymbol
            />
          ),
          amount: (
            <Amount value={data.props.amount} symbol={'PCX'} hideSymbol />
          ),
          hasFillAmount: (
            <HasFill fill={hasFill} total={data.props.amount} symbol={'PCX'} />
          ),
          status: <OrderStatus value={data.status} />,
          key: idx
        }
      })}
      columns={[
        {
          title: $t('dex_open_order_account'),
          dataIndex: 'accountid'
        },
        {
          title: $t('dex_order_number'),
          dataIndex: 'id'
        },
        {
          title: $t('dex_order_direction'),
          dataIndex: 'direction'
        },
        {
          title: $t('dex_order_price'),
          dataIndex: 'price'
        },
        {
          title: $t('dex_order_amount'),
          dataIndex: 'amount'
        },
        {
          title: $t('dex_fill_percent'),
          dataIndex: 'hasFillAmount'
        },
        {
          title: $t('common_status'),
          dataIndex: 'status'
        }
      ]}
    />
  )
}
