import React, { useMemo } from 'react'
import { Table, Amount, TokenName, TokenChain } from '../../../components'
import api from '../../../services/api'
import { useLoad } from '../../../utils/hooks'
import { useParams } from 'react-router-dom'
import $t from '../../../locale'

export default function AccountAsset(props) {
  const { address } = useParams()
  const params = useMemo(() => [address], [address])

  const { items: nativeAssets, loading, total } = useLoad(
    api.fetchTransactoin,
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
        dataSource={[
          {
            key: nativeAssets.token,
            token: <TokenName value={nativeAssets.token} />,
            free: (
              <Amount
                value={nativeAssets.Free}
                symbol={nativeAssets.token}
                hideSymbol={true}
              />
            ),
            reservedStaking: (
              <Amount
                value={nativeAssets.ReservedStaking}
                symbol={nativeAssets.token}
                hideSymbol={true}
              />
            ),
            reservedStakingRevocation: (
              <Amount
                value={nativeAssets.ReservedStakingRevocation}
                symbol={nativeAssets.token}
                hideSymbol={true}
              />
            ),
            reservedDexSpot: (
              <Amount
                value={nativeAssets.ReservedDexSpot}
                symbol={nativeAssets.token}
                hideSymbol={true}
              />
            ),
            reservedWithdrawal: (
              <Amount
                value={nativeAssets.ReservedWithdrawal}
                symbol={nativeAssets.token}
                hideSymbol={true}
              />
            ),
            total: (
              <Amount
                value={
                  nativeAssets.Free +
                  nativeAssets.ReservedStaking +
                  nativeAssets.ReservedStakingRevocation +
                  nativeAssets.ReservedDexSpot
                }
                symbol={nativeAssets.token}
                hideSymbol={true}
              />
            )
          }
        ]}
        columns={nativeColumns}
      />
    </div>
  )
}
