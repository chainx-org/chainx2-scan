import { useSelector } from 'react-redux'
import {
  foreignAssetsSelector,
  nativeAssetSelector
} from '@src/store/reducers/assetSlice'

export default function({ id }) {
  const native = useSelector(nativeAssetSelector)
  const foreignAssets = useSelector(foreignAssetsSelector)
  if (parseInt(id) === 0) {
    return native ? native.tokenSymbol : id
  }

  const asset = foreignAssets.find(a => parseInt(a.id) === parseInt(id))

  return asset ? asset.info.token : id
}
