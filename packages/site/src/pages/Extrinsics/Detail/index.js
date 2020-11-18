import { useParams } from 'react-router-dom'
import React, { useMemo } from 'react'
import { useLoadDetail } from '../../../utils/hooks'
import api from '../../../services/api'
import Breadcrumb from '../../../components/Breadcrumb'
import $t from '../../../locale'
import Spinner from '../../../components/Spinner'
import NoData from '../../../components/NoData'
import PanelList from '../../../components/PanelList'
import BlockLink from '../../../components/BlockLink'
import DateShow from '../../../components/DateShow'
import Events from './Events'
import { PanelJson } from '../../../components'
import TxLink from '../../../components/TxLink'
import AccountLink from '../../../components/AccountLink'
import TxAction from '../../../components/TxAction'
import Success from '../../../components/Success'
import Fail from '../../../components/Fail'

export default function() {
  const { hash } = useParams()
  const params = useMemo(() => [hash], [hash])
  const { detail: extrinsic, loading } = useLoadDetail(
    api.fetchExtrinsic,
    params
  )
  console.log(extrinsic)

  const breadcrumb = (
    <Breadcrumb
      dataSource={[
        { to: '/extrinsics', label: $t('ex_list') },
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

  if (!loading && !extrinsic) {
    return <NoData id={hash} />
  }

  return (
    <div>
      {breadcrumb}
      <PanelList
        dataSource={[
          {
            label: $t('block_height'),
            data: <BlockLink value={extrinsic.indexer.blockHeight} />
          },
          {
            label: $t('block_time'),
            data: <DateShow value={extrinsic.indexer.blockTime} />
          },
          {
            label: $t('ex_index'),
            data: extrinsic.indexer.index
          },
          {
            label: $t('ex_hash'),
            data: <TxLink className="text-truncate" value={hash} />
          },
          {
            label: $t('ex_signer'),
            data: <AccountLink value={extrinsic.signer} />
          },
          {
            label: $t('ex_section'),
            data: <TxAction module={extrinsic.section} />
          },
          {
            label: $t('ex_call'),
            data: <TxAction call={extrinsic.name} />
          },
          {
            label: $t('ex_params'),
            data: <PanelJson json={extrinsic.args} />
          },
          {
            label: $t('common_result'),
            data: extrinsic.isSuccess ? (
              <div style={{ display: 'flex' }}>
                <Success />
              </div>
            ) : (
              <div style={{ display: 'flex' }}>
                <Fail />
              </div>
            )
          },
          {
            label: $t('ex_version'),
            data: extrinsic.version
          },
          {
            label: 'Data',
            data: extrinsic.data
          }
        ]}
      />
      <Events extrinsicHash={hash} />
    </div>
  )
}
