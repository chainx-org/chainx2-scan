import React, { useEffect, useState } from 'react'

import { Table } from '../../../components'
import $t from '../../../locale'
import DateShow from '../../../components/DateShow'
import {
  accountVotesSelector,
  fetchVotes
} from '@src/store/reducers/accountSlice'
import { useDispatch, useSelector } from 'react-redux'
import AddressLink from '@components/AddressLink'

export default function AccountNomination({ address }) {
  const dispatch = useDispatch()
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    dispatch(fetchVotes(address, setLoading))
  }, [address, dispatch])

  const votes = useSelector(accountVotesSelector)
  console.log('votes', votes)

  return (
    <Table
      loading={loading}
      pagination={false}
      dataSource={(votes || []).map(data => {
        return {
          key: data.nominee,
          // blockTime: <DateShow value={data.indexer.blockTime} />,
          nominee: <AddressLink value={data.validator} short={true} />,
          nomination: data.nomination
          //revocations: <Amount value={data.revocations} hideSymbol />,
          // revocations: data.revocations,
          // updateHeight: data.last_vote_weight_update,
          // weight: data.last_vote_weight
        }
      })}
      columns={[
        {
          title: 'Validator',
          dataIndex: 'nominee'
        },
        // {
        //   title: $t('VOTETIME'),
        //   dataIndex: 'blockTime'
        // },
        // {
        //   title: $t('UPDATEWEIGHT'),
        //   dataIndex: 'updateHeight'
        // },
        // {
        //   title: $t('WEIGHT'),
        //   dataIndex: 'weight'
        // },
        {
          title: (
            <>
              {$t('BONDED')}
              (PCX)
            </>
          ),
          dataIndex: 'nomination'
        }
        // {
        //   title: (
        //     <>
        //       {$t('UNFREEZERESERVED')}
        //       (PCX)
        //     </>
        //   ),
        //   dataIndex: 'revocations',
        //   align: 'right'
        // }
      ]}
    />
  )
}
