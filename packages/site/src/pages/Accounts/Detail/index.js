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
import { store } from '../../../index'
import {
  fetchTrusteeNodes,
  fetchUnsettledNodes,
  fetchValidatorNodes,
  trusteeNodesSelector,
  unsettledNodesSelector,
  validatorNodesSelector
} from '../../../store/reducers/validatorsSlice'
import ValidatorLink from "../../../components/ValidatorLink";

export default function() {
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(9999999)
  const [loading, setLoading] = useState(false)
  const [activeKey, setActiveKey] = useState('assets')

  const { address } = useParams()
  const params = useMemo(() => [address], [address])

  const { detail: account } = useLoadDetail(api.fetchNativeAssets, params)
  const dispatch = useDispatch()
  useEffect(() => {
    dispatch(fetchTrusteeNodes(setLoading, page - 1, pageSize))
  }, [dispatch, page, pageSize])

  const { items = [] } = useSelector(trusteeNodesSelector) || {}
  useEffect(() => {
    dispatch(fetchUnsettledNodes(setLoading, page - 1, pageSize))
  }, [dispatch, page, pageSize])

  const { items: unsettledInfo } = useSelector(unsettledNodesSelector) || {}
  useEffect(() => {
    dispatch(fetchValidatorNodes(setLoading, page - 1, pageSize))
  }, [dispatch, page, pageSize])

  const { newitems = [] } = useSelector(validatorNodesSelector) || {}
  let validator = false
  for (let i = 0; i < items.length; i++) {
    const item = newitems[i]
    if (item) {
      if (item.account === address) {
        validator = true
      }
    }
  }

  let unsettled = false
  for (let i = 0; i < unsettledInfo.length; i++) {
    const item = unsettledInfo[i]
    if (item) {
      if (item.account === address) {
        unsettled = true
      }
    }
  }
  let trust = false
  for (let i = 0; i < items.length; i++) {
    const item = items[i]
    if (item) {
      if (item.account === address) {
        trust = true
      }
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
                {validator || trust || unsettled ? (
                    <div>
                      <ValidatorLink
                          name={'节点详情'}
                          className="text-truncate"
                          value={address}
                          style={{marginRight: '20px', color: 'white', background: 'rgba(70, 174, 226)', borderRadius: '4px',width: '6em',textAlign: 'center'}}
                      />
                    </div>
                ) : null}
                <AccountLink value={address} />
              </div>
            )
          },
          {
            label: $t('account_publickey'),
            data: pubKey
          },
          /*
          {
            label: $t('total_transaction_item'),
            data: account.refcount
          },
          */
          {
            label: $t('node_detail'),
            data: <ValidatorLink
                name={address}
                className="text-truncate"
                value={address}
            />
          },
          {
            label: $t('nonce'),
            data: account.nonce
          },
          // {
          //   label: $t('btc_recharge_address'),
          //   data: '--'
          // }
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
        {activeKey === 'deal' && <DealList address={address} />}
        {activeKey === 'deposit' && <DepositList address={address} />}
        {activeKey === 'withdrawal' && <WithdrawalList address={address} />}
      </div>
    </div>
  )
}
