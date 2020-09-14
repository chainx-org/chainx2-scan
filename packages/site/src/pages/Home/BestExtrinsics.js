import React from 'react'
import { useSelector } from 'react-redux'
import $t from '../../locale'
import { latestExtrinsicsSelector } from '../../store/reducers/latestExtrinsicSlice'
import TxLink from '../../components/TxLink'
import TxAction from '../../components/TxAction'
import loading from './Loading'
import SeeAll from './SeeAll'
import AddressLink from '@components/AddressLink'

export default function BestExtrinsics() {
  const extrinsics = useSelector(latestExtrinsicsSelector)

  return (
    <section className="panel">
      <div
        className="panel-heading"
        style={{ borderBottom: '1px solid #dbdbdb' }}
      >
        {$t('ex_latest')}
      </div>
      <div className="panel-block">
        <table className="table is-striped is-fullwidth data-table">
          <thead>
            <tr>
              <th>{$t('ex_hash')}</th>
              <th>{$t('ex_signer')}</th>
              <th className="has-text-right">{$t('ex_action')}</th>
            </tr>
          </thead>
          <tbody>
            {extrinsics && extrinsics.length
              ? extrinsics
                  .slice(0, 6)
                  .map(({ signer, hash, section, name }) => {
                    return (
                      <tr key={hash}>
                        <td>
                          <TxLink
                            style={{ width: 80 }}
                            className="text-truncate"
                            value={hash}
                          />
                        </td>
                        <td>
                          {signer ? (
                            <AddressLink short={true} value={signer} />
                          ) : (
                            '--'
                          )}
                        </td>
                        <td>
                          <TxAction module={section} call={name} />
                        </td>
                      </tr>
                    )
                  })
              : loading}
          </tbody>
        </table>
      </div>
      <SeeAll link="/extrinsics" />
    </section>
  )
}
