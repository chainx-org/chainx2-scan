import { useParams } from 'react-router-dom'
import { useLoadDetail } from '../../utils/hooks'
import api from '../../services/api'
import Breadcrumb from '../../components/Breadcrumb'
import $t from '../../locale'
import React from 'react'
import Spinner from '../../components/Spinner'
import NoData from '../../components/NoData'
import PanelList from '../../components/PanelList'
import BlockLink from '../../components/BlockLink'
import TxLink from '../../components/TxLink'
import TxAction from '@components/TxAction'
import { PanelJson } from '../../components'

const { useMemo } = require('react')

export default function() {
  const { eventId } = useParams()
  console.log('eventId', eventId)

  const params = useMemo(() => [eventId], [eventId])

  const { detail: event, loading } = useLoadDetail(api.fetchEvent, params)

  const breadcrumb = (
    <Breadcrumb
      dataSource={[
        { to: '/events', label: $t('event_list') },
        { label: $t('event_list') }
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

  if (!loading && !event) {
    return <NoData id={eventId} />
  }

  return (
    <div>
      {breadcrumb}
      <PanelList
        dataSource={[
          {
            label: $t('block_height'),
            data: <BlockLink value={event.indexer.blockHeight} />
          },
          {
            label: $t('ex_hash'),
            data: <TxLink value={event.extrinsicHash} />
          },
          {
            label: $t('event_index'),
            data: event.sort
          },
          {
            label: $t('common_module'),
            data: <TxAction module={event.section} />
          },
          {
            label: $t('event_method'),
            data: <TxAction call={event.method} />
          },
          {
            label: 'Meta',
            data: <PanelJson json={event.meta} />
          },
          {
            label: 'Attributes',
            data: <PanelJson json={event.data} />
          }
        ]}
      />
    </div>
  )
}
