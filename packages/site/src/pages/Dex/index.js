import React, { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { fetchPairs } from '@src/store/reducers/dexSlice'
import PairList from '@src/pages/Dex/PairList'

export default function() {
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(fetchPairs())
  }, [])

  return (
    <>
      <div className="columns">
        <div className="column">
          <PairList />
        </div>
      </div>

      <div className="box"></div>
    </>
  )
}
