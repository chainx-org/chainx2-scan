import React, { useMemo } from 'react'
import { Amount, Table } from '../../../components'
import api from '../../../services/api'

import { useLoadDetail } from '../../../utils/hooks'

import { useParams } from 'react-router-dom'
import $t from '../../../locale'
import { safeAdd } from '@src/shared'

export default function AccountAsset(props) {
  const { address } = useParams()
  const params = useMemo(() => [address], [address])

  const { detail: nativeAsset, loading } = useLoadDetail(
    api.fetchNativeAssets,
    params
  )

  const nativeColumns = [
    {
      title: $t('ASSETNAME'),
      dataIndex: 'token'
    },
    {
      title: $t('usable'),
      dataIndex: 'usable',
      align: 'right'
    },
    /*
    {
      title: $t('STAKINGRESERVED'),
      dataIndex: 'reservedStaking',
      align: 'right'
    },
    {
      title: $t('UNFREEZERESERVED'),
      dataIndex: 'reservedStakingRevocation',
      align: 'right'
    },
    {
      title: $t('DEXRESERVED'),
      dataIndex: 'reservedDexSpot',
      align: 'right'
    },
    */
    {
      title: $t('reserved'),
      dataIndex: 'reserved',
      align: 'right'
    },
    {
      title: $t('frozen'),
      dataIndex: 'frozen',
      align: 'right'
    },
    {
      title: $t('BLOCKTOTALBALANCE'),
      dataIndex: 'total',
      align: 'right'
    }
  ]

  return (
    <div>
      <div className="asset-title">{$t('CHAINX_ASSET')}</div>
      <Table
        loading={loading}
        pagination={false}
        dataSource={
          nativeAsset &&
          [{ ...nativeAsset, token: 'PCX' }].map(item => {
            return {
              key: item.token,
              token: item.token,
              usable: (
                <Amount
                  value={item.data.free - item.data.miscFrozen}
                  symbol={item.token}
                  hideSymbol={true}
                />
              ),
              reserved: (
                <Amount
                  value={item.data.reserved}
                  symbol={item.token}
                  hideSymbol={true}
                />
              ),
              /*
              reservedStaking: (
                <Amount
                  value={item.stakingReserved.bonded}
                  symbol={item.token}
                  hideSymbol={true}
                />
              ),
              reservedStakingRevocation: (
                <Amount
                  value={item.stakingReserved.bondedWithdrawal}
                  symbol={item.token}
                  hideSymbol={true}
                />
              ),
              reservedDexSpot: (
                <Amount
                  value={item.dexReserved}
                  symbol={item.token}
                  hideSymbol={true}
                />
              ),
              */
              frozen: (
                <Amount
                  value={item.data.miscFrozen}
                  symbol={item.token}
                  hideSymbol={true}
                />
              ),
              total: (
                <Amount
                  value={item.data.free - item.data.reserved}
                  symbol={item.token}
                  hideSymbol={true}
                />
              )
            }
          })
        }
        columns={nativeColumns}
      />
    </div>
  )
}
