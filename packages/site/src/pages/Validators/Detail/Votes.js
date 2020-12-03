import React, { useEffect, useState } from 'react'
import { Table } from '../../../components'
import $t from '../../../locale'
import { useDispatch, useSelector } from 'react-redux'
import {
  BlockNumSelector,
  fetchblockNum,
  validatorVotesSelector,
  fetchValidatorVotes
} from '../../../store/reducers/validatorsSlice'
import TxLink from '../../../components/TxLink'
import BlockLink from '../../../components/BlockLink'
import DateShow from '../../../components/DateShow'
import AccountLink from '../../../components/AccountLink'
import AddressLink from '../../../components/AddressLink'
import Amount from '../../../components/Amount'

export default function({ address }) {
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(20)
  const dispatch = useDispatch()
  const [loading, setLoading] = useState(false)
  useEffect(() => {
    dispatch(fetchValidatorVotes(setLoading, address, page - 1, pageSize))
  }, [dispatch, address, page, pageSize])

  const { items = [], total } = useSelector(validatorVotesSelector) || {}
  const width = document.documentElement.clientWidth
  const simple = width < 1024
  return (
    <Table
      loading={loading}
      onChange={({ current, pageSize: size }) => {
        setPage(current)
        setPageSize(size)
      }}
      pagination={{ current: page, pageSize, total, simple }}
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
          nominee: (
            <AccountLink
              style={{ width: 136 }}
              className="text-truncate"
              value={item.data[1]}
              short={true}
            />
          ),
          balance: (
            <Amount value={item.data[2]} precision={8} hideSymbol={true} />
          ),
          blockTime: <DateShow value={item.indexer.blockTime} />,
          blockHeight: <BlockLink value={item.indexer.blockHeight} />
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
