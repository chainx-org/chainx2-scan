import React, { useMemo, useState } from 'react'
import api from '../../services/api'
import {Amount, Table} from '../../components'
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

    const { items: accounts, loading, total } = useLoad(
        api.fetchAccounts,
        params
    )

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
                    address: <AccountLink value={item.account} />,
                    avalibleBalance: <Amount
                        value={item.pcx.free}
                    /> ,
                    totalBalance: 0,
                    totalBtc: 0,
                    totalAccount: item.count
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
                },
                {
                    title: $t('total_btc_item'),
                    dataIndex: '--'
                },

                {
                    title: $t('total_transaction_item'),
                    dataIndex: 'totalAccount'
                }
            ]}
        />
    )
}
