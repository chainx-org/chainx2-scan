import { useParams } from 'react-router-dom'
import React, { useMemo } from 'react'
import { useLoadDetail } from '../../../utils/hooks'
import api from '../../../services/api'
import Breadcrumb from '../../../components/Breadcrumb'
import $t from '../../../locale'
import Spinner from '../../../components/Spinner'
import NoData from '../../../components/NoData'
import PanelList from '../../../components/PanelList'
import AccountLink from '../../../components/AccountLink'
//import Accounts from './Accounts'


export default function() {
    const { hash } = useParams()
    const params = useMemo(() => [hash], [hash])
    const { detail: accounts, loading } = useLoadDetail(
        api.fetchAccounts,
        params
    )

    const breadcrumb = (
        <Breadcrumb
            dataSource={[
                { to: '/accounts', label: $t('ex_list') },
                { label: $t('ex_detail') }
            ]}
        />
    )

    if (loading) {
        return (
            <div>
                {breadcrumb}
                <div style={{ padding: '10%' }}>
                    <Spinner />
                </div>
            </div>
        )
    }

    if (!loading && !accounts) {
        return <NoData id={hash} />
    }

    return (
        <div>
            {breadcrumb}
            <PanelList
                dataSource={[
                    {
                        label: $t('block_height'),
                        data: <AccountLink value={accounts.account} />
                    },
                    {
                        label: $t('block_time'),
                        data: accounts.account
                    },
                    {
                        label: $t('ex_index'),
                        data: accounts.account
                    },
                    {
                        label: $t('ex_signer'),
                        data: '--'
                    }
                ]}
            />

        </div>
    )
}
