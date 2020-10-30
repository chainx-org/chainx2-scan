import React, { useMemo, useState } from 'react'
import api from '../../services/api'
import { Amount, Table } from '../../components'
import $t from '../../locale'
import AccountLink from '../../components/AccountLink'
import { useLoad } from '../../utils/hooks'

export default function({ blockHeight }) {
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(20)
  const params = useMemo(() => {
    return blockHeight
      ? { block: blockHeight, page, pageSize }
      : { page, pageSize }
  }, [blockHeight, page, pageSize])

  const { items: accounts, loading, total } = useLoad(api.fetchAccounts, params)

  return (
    <Table
      loading={loading}
      onChange={({ current, pageSize: size }) => {
        setPage(current)
        setPageSize(size)
      }}
      pagination={{ current: page, pageSize, total }}
      dataSource={accounts.map(item => {
        return {
          key: item._id,
          address: <AccountLink value={item.address} />,
          avalibleBalance: <Amount value={item.data.free} />,
          totalBalance: (
            <Amount minDigits={8} value={item.data.free + item.data.reserved} />
          )
          // totalBtc: (
          //   <Amount
          //     symbol="BTC"
          //     value={item && item.btc ? item.btc.Usable : 0}
          //     hideSymbol
          //   />
          // ),
          // totalAccount: item.count ? item.count : 0
        }
      })}
      columns={[
        {
          title: $t('address_item'),
          dataIndex: 'address'
        },
        {
          title: $t('avaliable_balance_item'),
          dataIndex: 'avalibleBalance'
        },
        {
          title: $t('total_balance_item'),
          dataIndex: 'totalBalance'
        }
        // {
        //   title: $t('total_btc_item'),
        //   dataIndex: 'totalBtc'
        // },
        //
        // {
        //   title: $t('total_transaction_item'),
        //   dataIndex: 'totalAccount'
        // }
      ]}
    />
  )
}
