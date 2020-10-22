import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  fetchCrossTrustees,
  crossTrusteesSelector
} from '@src/store/reducers/crossBlocksSlice'
import Table from '@components/Table'
import Amount from '@components/Amount'
import $t from '@src/locale'
import AddressLink from '@components/AddressLink'
import CommonLink from '@components/CommonLink'
import TxLink from '@components/TxLink'
import TxType from '@components/TxType'
import BlockLink from '@components/BlockLink'
import DateShow from '@components/DateShow'
import ExternalLink from '@components/ExternalLink'
import NumberFormat from '@components/NumberFormat'
import Hash from '@components/Hash'

import swapEndian from '../../../utils/swapEndian'

export default function CrossHost({ address }) {
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(20)
  const [loading, setLoading] = useState(false)

  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(fetchCrossTrustees(setLoading, page - 1, pageSize))
  }, [dispatch, page, pageSize])

  const { items = [], total } = useSelector(crossTrusteesSelector) || {}

  return (
    <Table
      onChange={({ current, pageSize: size }) => {
        setPage(current)
        setPageSize(size)
      }}
      pagination={{ current: page, pageSize, total }}
      dataSource={items.map(item => {
        // const btcHashForExplorer = swapEndian(item.btcHash.slice(2))
        // const btcTxHashForExplorer = swapEndian(item.btcTxHash.slice(2))
        return {
          key: item._id,
          /*
          btc_hash: (
            <ExternalLink
              type="btcTestnetHash"
              value={btcHashForExplorer}
              render={() => {
                return (
                  <Hash
                    style={{ width: 138 }}
                    className="text-truncate"
                    value={btcHashForExplorer}
                  />
                )
              }}
            />
          ),
          btc_tx_hash: (
            <ExternalLink
              type="btcTestnetTxid"
              value={btcTxHashForExplorer}
              render={() => {
                return (
                  <Hash
                    style={{ width: 138 }}
                    className="text-truncate"
                    value={btcTxHashForExplorer}
                  />
                )
              }}
            />
          ),
          */
          threshold: item.threshold,
          name: item.name,
          chainx_address: (
            <AddressLink
              // style={{ width: 138 }}
              // className="text-truncate"
              value={item.address}
            />
          ),
          hot_btc_pubkey: (
            <CommonLink
              style={{ width: 138 }}
              className="text-truncate"
              value={item.hotPubkey}
              link={'#'}
            />
          ),
          cold_btc_pubkey: (
            <CommonLink
              style={{ width: 138 }}
              className="text-truncate"
              value={item.coldPubkey}
              link={'#'}
            />
          )
          // hot_address: item.hotPubkey,
          /*
          tx_balance: (
            <Amount value={item.balance} precision={8} symbol={'BTC'} />
          ),
          chainx_ex_hash: (
            <TxLink
              style={{ width: 138 }}
              className="text-truncate"
              value={item.chainxExtrinsicHash}
            />
          ),
          chainx_address: (
            <AddressLink
              style={{ width: 138 }}
              className="text-truncate"
              value={item.address}
            />
          ),
          asset_type: 'BTC',
          chainx_time: <DateShow value={item.chainxTime} />,
          session_number: '1',
          trustees: 'MathWallet'
          */
        }
      })}
      columns={[
        {
          title: $t('session_number'),
          dataIndex: 'threshold'
        },
        {
          title: $t('trustee'),
          dataIndex: 'chainx_address'
        },
        {
          title: $t('hot_btc_pubkey'),
          dataIndex: 'hot_btc_pubkey'
        },
        {
          title: $t('cold_btc_pubkey'),
          dataIndex: 'cold_btc_pubkey'
        }
      ]}
    />
  )
}
