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
import DealList from './DealList'
import ValidatorLink from '../../../components/ValidatorLink'
import BalanceHistory from './BalanceHistory'
import {
  accountTypeSelector,
  fetchAccountType
} from '../../../store/reducers/accountSlice'
import { ValidatorInfoSelector } from '../../../store/reducers/validatorsSlice'

export default function() {
  const [loading, setLoading] = useState(false)
  const [activeKey, setActiveKey] = useState('assets')

  const { address } = useParams()
  const params = useMemo(() => [address], [address])

  const { detail: account } = useLoadDetail(api.fetchNativeAssets, params)
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(fetchAccountType(setLoading, address))
  }, [dispatch])
  const { data } = useSelector(accountTypeSelector) || {}
  let trust = false
  let unsettled = false
  let validator = false
  if (data) {
    trust = data.trust
    unsettled = data.unsettled
    validator = data.validator
  }

  const { items: info } = useSelector(ValidatorInfoSelector) || {}
  let name = ''
  for (let i = 0; i < info.length; i++) {
    if (info[i].account === address) {
      name = info[i].referralId
    }
  }

  const pubKey = decodeAddress(address) || ''
  const breadcrumb = (
    <Breadcrumb
      dataSource={[
        { to: '/accounts', label: $t('accounts_list') },
        { label: $t('account_detail') }
      ]}
    />
  )

  if (!account) {
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
            data: (
              <div style={{ display: 'flex' }}>
                <AccountLink value={address} />
              </div>
            )
          },
          {
            label: $t('account_publickey'),
            data: pubKey
          },
          {
            label: $t('nonce'),
            data: account.nonce
          },
          validator || trust || unsettled
            ? {
                label: $t('node_type'),
                data: (
                  <div style={{ display: 'flex' }}>
                    {trust ? (
                      <div>
                        <div
                          style={{
                            marginRight: '20px',
                            background: 'rgba(246, 201, 74)',
                            borderRadius: '4px',
                            color: 'black',
                            width: '6em',
                            textAlign: 'center'
                          }}
                        >
                          {$t('trustee_node')}
                        </div>
                      </div>
                    ) : null}
                    {unsettled ? (
                      <div
                        style={{
                          marginRight: '20px',
                          background: 'rgba(246, 201, 74)',
                          borderRadius: '4px',
                          color: 'black',
                          width: '6em',
                          textAlign: 'center'
                        }}
                      >
                        {$t('sync_node')}
                      </div>
                    ) : null}
                    {validator ? (
                      <div
                        style={{
                          marginRight: '20px',
                          background: 'rgba(246, 201, 74)',
                          borderRadius: '4px',
                          color: 'black',
                          width: '6em',
                          textAlign: 'center'
                        }}
                      >
                        {$t('validator_node')}
                      </div>
                    ) : null}
                  </div>
                )
              }
            : '',
          validator || trust || unsettled
            ? {
                label: $t('node_detail'),
                data: (
                  <ValidatorLink
                    name={name}
                    className="text-truncate"
                    value={address}
                  />
                )
              }
            : ''
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
            <li
              onClick={() => setActiveKey('balanceHistory')}
              className={classnames({
                'is-active': activeKey === 'balanceHistory'
              })}
            >
              <a>{$t('balance_history')}</a>
            </li>
          </ul>
        </div>
        {activeKey === 'assets' && <AcccountAsset address={address} />}
        {activeKey === 'transfer' && <TransferList address={address} />}
        {activeKey === 'transaction' && <TransActionList address={address} />}
        {activeKey === 'vote' && <NominationList address={address} />}
        {activeKey === 'order' && <OrderList address={address} />}
        {activeKey === 'deal' && <DealList address={address} />}
        {activeKey === 'deposit' && <DepositList address={address} />}
        {activeKey === 'withdrawal' && <WithdrawalList address={address} />}
        {activeKey === 'balanceHistory' && <BalanceHistory />}
      </div>
    </div>
  )
}
