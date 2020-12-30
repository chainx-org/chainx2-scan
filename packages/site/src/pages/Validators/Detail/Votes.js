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
  console.log('items', items)
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
      expandedRowRender={data => {
        const items = data.oldItems
        const rows = items.map(item => (
          <tr>
            <td>
              <AccountLink
                style={{ width: 136 }}
                className="text-truncate"
                value={item.data[0]}
                short={true}
              />
            </td>
            <td>
              <DateShow value={item.indexer.blockTime} />
            </td>
            <td>
              <BlockLink value={item.indexer.blockHeight} />
            </td>
            <td>
              <Amount value={item.data[2]} precision={8} hideSymbol={true} />
            </td>
          </tr>
        ))
        return (
          <table>
            <thead>
              <tr>
                <th>{$t('nominator')}</th>
                <th>{$t('VOTETIME')}</th>
                <th>{$t('UPDATEWEIGHT')}</th>
                <th>{$t('BONDED')}(PCX)</th>
              </tr>
            </thead>
            <tbody>{rows}</tbody>
          </table>
        )
      }}
      dataSource={items.map(entry => {
        const item = entry[1][0]
        const oldItems = entry[1].slice(1)
        return {
          key: item._id,
          // blockTime: <DateShow value={data.indexer.blockTime} />,

          oldItems: oldItems,
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
          voteCount: entry[1].length,
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
          title: $t('vote_count'),
          dataIndex: 'voteCount'
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
