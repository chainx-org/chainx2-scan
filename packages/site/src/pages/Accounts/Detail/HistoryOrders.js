import React, { useState, useEffect, useMemo } from 'react'

import { Table, Amount, ValidatorLink, NumberFormat } from '../../../components'
import api from '../../../services/api'
import $t from '../../../locale'
import { FormattedMessage } from 'react-intl'
import { useLoad } from '../../../utils/hooks'
import { useParams } from 'react-router-dom'
import DateShow from '../../../components/DateShow'

export default function AccountNomination(props) {
  const [list, setList] = useState([])
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(20)

  const { address } = useParams()

  const params = useMemo(() => {
    return address ? { address: address, page, pageSize } : { page, pageSize }
  }, [address, page, pageSize])

  const { items: nominationList, loading } = useLoad(
    api.fetchAccountNominations,
    params
  )

  const getRevocations = revocations => {
    return JSON.parse(revocations)
      .flat()
      .reduce((a, b) => a + b, 0)
  }

  return (
    <Table
      loading={loading}
      pagination={false}
      dataSource={
        nominationList &&
        nominationList.map(data => {
          return {
            key: data.nominee,
            blockTime: <DateShow value={data.indexer.blockTime} />,
            //nominee: <ValidatorLink value={data.nominee} />,
            nomination: data.nomination,
            //revocations: <Amount value={data.revocations} hideSymbol />,
            revocations: data.revocations,
            updateHeight: data.last_vote_weight_update,
            weight: data.last_vote_weight
          }
        })
      }
      columns={[
        {
          title: $t('VOTETIME'),
          dataIndex: 'blockTime'
        },
        {
          title: $t('UPDATEWEIGHT'),
          dataIndex: 'updateHeight'
        },
        {
          title: $t('WEIGHT'),
          dataIndex: 'weight'
        },
        {
          title: (
            <>
              {$t('BONDED')}
              (PCX)
            </>
          ),
          dataIndex: 'nomination'
        },
        {
          title: (
            <>
              {$t('UNFREEZERESERVED')}
              (PCX)
            </>
          ),
          dataIndex: 'revocations',
          align: 'right'
        }
      ]}
    />
  )
}
