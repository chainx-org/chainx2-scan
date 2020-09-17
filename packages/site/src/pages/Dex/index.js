import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { fetchPairs } from '@src/store/reducers/dexSlice'

export default function() {
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(fetchPairs())
  }, [])

  return 'Dex will be available soon'
}
