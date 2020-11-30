import React, { useMemo, useState } from 'react'
import classnames from 'classnames'
import Breadcrumb from '../../../components/Breadcrumb'
import $t from '../../../locale'
import { NavLink, useParams } from 'react-router-dom'
import api from '../../../services/api'
import Spinner from '../../../components/Spinner'
import { useSelector } from 'react-redux'
import { latestHeightSelector } from '../../../store/reducers/latestBlockSlice'
import PanelList from '../../../components/PanelList'
import BlockLink from '../../../components/BlockLink'
import DateShow from '../../../components/DateShow'
import Extrinsics from './Extrinsics'
import { useLoad, useLoadDetail } from '../../../utils/hooks'
import NoData from '../../../components/NoData'
import Paneljson from '../../../components/PanelJson'
import { encodeAddress } from '../../../shared'
import ValidatorLink from '../../../components/ValidatorLink'
export default function() {
  const { heightOrHash } = useParams()
  const params = useMemo(() => [heightOrHash], [heightOrHash])
  const { detail: block, loading } = useLoadDetail(api.fetchBlock, params)
  const latestHeight = useSelector(latestHeightSelector)
  const hasNext = block?.header?.number < latestHeight
  const preHeight = block?.header?.number - 1
  const deviceWidth = document.documentElement.clientWidth

  const { items: blocks, total } = useLoad(api.fetchBlocks, params)
  let name = ''
  for (let i = 0; i < blocks.length; i++) {
    if (blocks[i].author === block?.author) {
      name = blocks[i].referralId
    }
  }
  const header =
    deviceWidth < 1024 ? null : (
      <div className="switch-block">
        <NavLink
          to={`/blocks/${preHeight < 0 ? block?.header?.number : preHeight}`}
        >
          <i
            className={classnames(
              { forbidden: preHeight < 0 },
              'iconfont icon-left'
            )}
          />
        </NavLink>
        {$t('block_height')}:{block?.header?.number}
        <NavLink
          to={
            hasNext
              ? `/blocks/${block?.header?.number + 1}`
              : `/blocks/${block?.header?.number}`
          }
        >
          <i
            className={classnames(
              { forbidden: !hasNext },
              'iconfont icon-right'
            )}
          />
        </NavLink>
      </div>
    )

  const breadcrumb = (
    <Breadcrumb
      dataSource={[
        { to: '/blocks', label: $t('block_list') },
        { label: $t('block_detail') }
      ]}
    />
  )

  if (loading) {
    return (
      <>
        {breadcrumb}
        <div style={{ padding: '10%' }}>
          <Spinner />
        </div>
      </>
    )
  }

  if (!loading && !block) {
    return <NoData id={heightOrHash} />
  }

  return (
    <div>
      {breadcrumb}
      {header}
      <PanelList
        dataSource={[
          {
            label: $t('block_height'),
            data: block?.header?.number
          },
          {
            label: $t('block_hash'),
            data: block?.hash
          },
          {
            label: $t('block_parent_hash'),
            data: <BlockLink value={block?.header?.parentHash} />
          },
          {
            label: $t('block_state_root'),
            data: block?.header?.stateRoot
          },
          {
            label: $t('block_extrinsics_root'),
            data: block?.header?.extrinsicsRoot
          },
          {
            label: $t('block_time'),
            data: (
              <DateShow value={block?.blockTime} format="YYYY-MM-DD HH:mm:ss" />
            )
          },
          {
            label: $t('block_digest'),
            data: <Paneljson json={block?.header?.digest} />
          },
          {
            label: $t('block_author'),
            data: (
              <ValidatorLink
                name={name}
                style={{ width: 138 }}
                className="text-truncate"
                value={encodeAddress(block?.author)}
              />
            )
          }
        ]}
      />
      <Extrinsics blockHeight={block?.header?.number} />
    </div>
  )
}
