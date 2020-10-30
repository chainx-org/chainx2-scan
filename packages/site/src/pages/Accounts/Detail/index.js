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
import DepositList from './DepositList'
import WithdrawalList from './WithdrawalList'
import AcccountAsset from './AcccountAsset'
import classnames from 'classnames'
import { decodeAddress } from '@src/shared'

export default function() {
  const [activeKey, setActiveKey] = useState('assets')

  const { address } = useParams()
  const params = useMemo(() => [address], [address])

  const { detail: account, loading } = useLoadDetail(api.fetchAccount, params)
  const pubKey = account?.address ? decodeAddress(account.address) : ''

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
              <a>{$t('assets_list')}</a>
            </li>
            <li
              onClick={() => setActiveKey('transfer')}
              className={classnames({ 'is-active': activeKey === 'transfer' })}
            >
              <a>{$t('transfer_list')}</a>
            </li>

            <li
              onClick={() => setActiveKey('transaction')}
              className={classnames({
                'is-active': activeKey === 'transaction'
              })}
            >
              <a>{$t('transaction_list')}</a>
            </li>

            <li
              onClick={() => setActiveKey('vote')}
              className={classnames({ 'is-active': activeKey === 'vote' })}
            >
              <a>{$t('nomination_list')}</a>
            </li>

            <li
              onClick={() => setActiveKey('order')}
              className={classnames({ 'is-active': activeKey === 'order' })}
            >
              <a>{$t('open_order_list')}</a>
            </li>

            <li
              onClick={() => setActiveKey('deal')}
              className={classnames({ 'is-active': activeKey === 'deal' })}
            >
              <a>{$t('closed_deal_list')}</a>
            </li>
            <li
              onClick={() => setActiveKey('deposit')}
              className={classnames({ 'is-active': activeKey === 'deposit' })}
            >
              <a>{$t('deposit_list')}</a>
            </li>
            <li
              onClick={() => setActiveKey('withdrawal')}
              className={classnames({
                'is-active': activeKey === 'withdrawal'
              })}
            >
              <a>{$t('withdrawal_list')}</a>
            </li>
          </ul>
        </div>
        {activeKey === 'assets' && <AcccountAsset address={address} />}
        {activeKey === 'transfer' && <TransferList address={address} />}
        {activeKey === 'transaction' && <TransActionList address={address} />}
        {activeKey === 'vote' && <NominationList address={address} />}
        {activeKey === 'order' && <OrderList address={address} />}
        {activeKey === 'deposit' && <DepositList address={address} />}
        {activeKey === 'withdrawal' && <WithdrawalList address={address} />}
      </div>
    </div>
  )
}
