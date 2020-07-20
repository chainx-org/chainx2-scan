import React from 'react'
import { useSelector } from 'react-redux'
import { latestBlocksSelector } from '../../store/reducers/latestBlockSlice'
import $t from '../../locale'
import Spinner from '../../components/Spinner'
import BlockLink from '../../components/BlockLink'
import NumberFormat from '../../components/NumberFormat'
import SeeAll from './SeeAll'

export default function BestBlocks() {
  const blocks = useSelector(latestBlocksSelector)

  const loading = (
    <tr style={{ height: 222, background: '#fff' }}>
      <td colSpan="3" style={{ verticalAlign: 'middle' }}>
        <Spinner />
      </td>
    </tr>
  )

  return (
    <section className="panel">
      <div
        className="panel-heading"
        style={{ borderBottom: '1px solid #dbdbdb' }}
      >
        {$t('block_latest_blocks')}
      </div>
      <div className="panel-block">
        <table className="table is-striped is-fullwidth data-table">
          <thead>
            <tr>
              <th>{$t('block_height')}</th>
              <th>{$t('common_validator')}</th>
              <th className="has-text-right">{$t('block_extrinsic_num')}</th>
            </tr>
          </thead>
          <tbody>
            {blocks && blocks.length
              ? blocks.slice(0, 6).map(({ number, extrinsicsCnt }) => {
                  return (
                    <tr key={number}>
                      <td>
                        <BlockLink value={number} />
                      </td>
                      <td>--</td>
                      <td className="has-text-right">
                        <NumberFormat value={extrinsicsCnt} />
                      </td>
                    </tr>
                  )
                })
              : loading}
          </tbody>
        </table>
      </div>
      <SeeAll link="/blocks" />
    </section>
  )
}
