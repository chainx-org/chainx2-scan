import React, { useEffect, useState } from 'react'

import { Amount, Table } from '../../../components'
import $t from '../../../locale'
import {
  accountVotesSelector,
  fetchVotes
} from '@src/store/reducers/accountSlice'
import { useDispatch, useSelector } from 'react-redux'
import AddressLink from '@components/AddressLink'
import AccountLink from '@components/AccountLink'
import BlockLink from '../../../components/BlockLink'
import DateShow from '../../../components/DateShow'

export default function AccountNomination({ address }) {
  const dispatch = useDispatch()
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    dispatch(fetchVotes(address, setLoading))
  }, [address, dispatch])

  const { items } = useSelector(accountVotesSelector) || {}
  return (
    <Table
      loading={loading}
      pagination={false}
      scroll={{
        x: '100vh'
      }}
      dataSource={items.map(item => {
        return {
          key: item._id,
          // blockTime: <DateShow value={data.indexer.blockTime} />,
          nominator: (
            <AccountLink
              style={{ width: 136 }}
              className="text-truncate"
              value={item.data[0]}
              short={true}
            />
          ),
          nominee:
            item.method === 'Rebonded' ? (
              <AccountLink
                style={{ width: 136 }}
                className="text-truncate"
                value={item.data[2]}
                short={true}
              />
            ) : (
              <AccountLink
                style={{ width: 136 }}
                className="text-truncate"
                value={item.data[1]}
                short={true}
              />
            ),
          balance:
            item.method === 'Rebonded' ? (
              <Amount value={item.data[3]} precision={8} hideSymbol={true} />
            ) : (
              <Amount value={item.data[2]} precision={8} hideSymbol={true} />
            ),
          blockTime: <DateShow value={item.indexer.blockTime} />,
          blockHeight: <BlockLink value={item.indexer.blockHeight} />,
          method: <div>{item.method}</div>
          //nomination: item.nomination
          //revocations: <Amount value={data.revocations} hideSymbol />,
          // revocations: data.revocations,
          // updateHeight: data.last_vote_weight_update,
          // weight: data.last_vote_weight
        }
      })}
      columns={[
        {
          title: $t('nominator'),
          dataIndex: 'nominator'
        },
        {
          title: $t('nominee'),
          dataIndex: 'nominee'
        },
        {
          title: $t('VOTETIME'),
          dataIndex: 'blockTime'
        },
        {
          title: $t('UPDATEWEIGHT'),
          dataIndex: 'blockHeight'
        },
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
          dataIndex: 'balance'
        },
        {
          title: $t('common_operation'),
          dataIndex: 'method'
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
