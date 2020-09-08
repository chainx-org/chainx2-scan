import React, { useMemo } from 'react'
import { Table, Amount, TokenName, TokenChain } from '../../../components'
import api from '../../../services/api'
import { useLoadDetail } from '../../../utils/hooks'
import { useParams } from 'react-router-dom'
import $t from '../../../locale'

export default function AccountAsset(props) {
  const { address } = useParams()
  const params = useMemo(() => [address], [address])

  const { detail: nativeAssets, loading } = useLoadDetail(
    api.fetchNativeAssets,
    params
  )

  const nativeColumns = [
    {
      title: $t('ASSETNAME'),
      dataIndex: 'token'
    },
    {
      title: $t('FREEBALANCE'),
      dataIndex: 'free',
      align: 'right'
    },
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
          nativeAssets &&
          nativeAssets.items.map(item => {
            debugger
            return {
              key: item.token,
              token: item.token,
              free: (
                <Amount
                  value={item.Free}
                  symbol={item.token}
                  hideSymbol={true}
                />
              ),
              reservedStaking: (
                <Amount
                  value={item.ReservedStaking}
                  symbol={item.token}
                  hideSymbol={true}
                />
              ),
              reservedStakingRevocation: (
                <Amount
                  value={item.ReservedStakingRevocation}
                  symbol={item.token}
                  hideSymbol={true}
                />
              ),
              reservedDexSpot: (
                <Amount
                  value={item.ReservedDexSpot}
                  symbol={item.token}
                  hideSymbol={true}
                />
              ),
              reservedWithdrawal: (
                <Amount
                  value={item.ReservedWithdrawal}
                  symbol={item.token}
                  hideSymbol={true}
                />
              ),
              total: (
                <Amount
                  value={
                    item.Free +
                    item.ReservedStaking +
                    item.ReservedStakingRevocation +
                    item.ReservedDexSpot
                  }
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
