import React, { useEffect, useMemo, useState } from 'react'
import Countdown, { zeroPad } from 'react-countdown'
import $t from '../../locale'
import halving from '../../assets/halving.png'
import { useDispatch, useSelector, shallowEqual } from 'react-redux'
import CountDown from '@components/CountDown'
import { latestChainStatusSelector } from '../../store/reducers/latestChainStatusSlice'
import { AntSpinner as Spinner } from '../../components'

const Halving = function() {
  const data = useSelector(latestChainStatusSelector) || {}
  const currentIndex = parseInt(data.current_index)
  const currentFinalized = parseInt(data.finalized)
  const halvingIndex = 55533
  const halvingBlock = 55533 * 50 - currentFinalized
  // const milliseconds = (halvingIndex - currentIndex) * 5 * 60 * 1000
  // const dateTime = new Date(Date.now() + milliseconds)

  const loading = (
    <div
      style={{
        height: 120,
        background: '#fff',
        width: '100%',
        display: 'flex',
        margin: '0 auto'
      }}
    >
      <Spinner style={{ height: '60px' }} />
    </div>
  )

  return (
    <div
    // style={{ width: 417, marginBottom: '1.25rem' }}
    ></div>
  )
}

export default Halving
