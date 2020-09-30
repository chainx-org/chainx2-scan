import { useParams } from 'react-router-dom'
import React, { useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useLoadDetail } from '../../../utils/hooks'
import api from '../../../services/api'
import Breadcrumb from '../../../components/Breadcrumb'
import $t from '../../../locale'
import Spinner from '../../../components/Spinner'
import NoData from '../../../components/NoData'
import PanelList from '../../../components/PanelList'
import AccountLink from '../../../components/AccountLink'
import TransferList from '../Detail/TransferList'
import TransActionList from '../Detail/TransactionList'
import NominationList from './NominationList'
import OrderList from './OrderList'
import AcccountAsset from './AcccountAsset'
import classnames from 'classnames'
import { decodeAddress } from '@src/shared'
import { fetchPairs, pairsSelector } from '@src/store/reducers/dexSlice'

export default function() {
  const [activeKey, setActiveKey] = useState('assets')

  const { address } = useParams()
  const params = useMemo(() => [address], [address])

  const { detail: account, loading } = useLoadDetail(api.fetchAccount, params)
  const pubKey = account?.address ? decodeAddress(account.address) : ''

  /*
  const dispatch = useDispatch()
  useEffect(() => {
    dispatch(fetchPairs())
  }, [dispatch])
  const pairs = useSelector(pairsSelector)
  console.log('pairs', pairs)
  */

  const breadcrumb = (
    <Breadcrumb
      dataSource={[
        { to: '/accounts', label: $t('accounts_list') },
        { label: $t('account_detail') }
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

  if (!loading && !account) {
    return <NoData id={address} />
  }

  return (
    <div>
      {breadcrumb}
      <PanelList
        dataSource={[
          {
            label: $t('address_item'),
            data: <AccountLink value={account.address} />
          },
          {
            label: $t('account_publickey'),
            data: pubKey
          },
          {
            label: $t('total_transaction_item'),
            data: account.extrinsicCount
          },
          {
            label: $t('btc_recharge_address'),
            data: '--'
          }
        ]}
      />

      <div className="box">
        <div className="tabs">
          <ul>
            <li
              onClick={() => setActiveKey('assets')}
              className={classnames({ 'is-active': activeKey === 'assets' })}
            >
              <a>资产列表</a>
            </li>
            <li
              onClick={() => setActiveKey('transfer')}
              className={classnames({ 'is-active': activeKey === 'transfer' })}
            >
              <a>转账列表</a>
            </li>

            <li
              onClick={() => setActiveKey('transaction')}
              className={classnames({
                'is-active': activeKey === 'transaction'
              })}
            >
              <a>交易列表</a>
            </li>

            <li
              onClick={() => setActiveKey('vote')}
              className={classnames({ 'is-active': activeKey === 'vote' })}
            >
              <a>投票列表</a>
            </li>

            <li
              onClick={() => setActiveKey('order')}
              className={classnames({ 'is-active': activeKey === 'order' })}
            >
              <a>当前委托列表</a>
            </li>
          </ul>
        </div>
        {activeKey === 'assets' && <AcccountAsset address={address} />}
        {activeKey === 'transfer' && <TransferList address={address} />}
        {activeKey === 'transaction' && <TransActionList address={address} />}
        {activeKey === 'vote' && <NominationList address={address} />}
        {activeKey === 'order' && <OrderList address={address} />}
      </div>
    </div>
  )
}
