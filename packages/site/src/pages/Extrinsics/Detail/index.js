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

export default function() {
  const { hash } = useParams()
  const params = useMemo(() => [hash], [hash])
  const { detail: extrinsic, loading } = useLoadDetail(
    api.fetchExtrinsic,
    params
  )

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
            label: $t('ex_signer'),
            data: '--'
          },
          {
            label: $t('ex_section'),
            data: extrinsic.section
          },
          {
            label: 'Call',
            data: extrinsic.name
          },
          {
            label: $t('ex_params'),
            data: (
              <pre
                style={{
                  textAlign: 'left',
                  backgroundColor: 'unset',
                  padding: 0,
                  color: '#959595'
                }}
              >
                {JSON.stringify(extrinsic.args, null, 2)}
              </pre>
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
