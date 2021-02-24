import React, { useEffect, useMemo, useState } from 'react'
import Countdown, { zeroPad } from 'react-countdown'
import $t from '../locale'

const CountDown = React.memo(props => {
  const { sessionIndex } = props
  const storedIndex = localStorage.getItem('sessionIndex') || 0
  let currentIndex
  if (storedIndex === sessionIndex) {
    currentIndex = storedIndex
  } else {
    localStorage.setItem('sessionIndex', sessionIndex)
    currentIndex = sessionIndex
  }

  const halvingIndex = 55533
  const milliseconds = (halvingIndex - currentIndex) * 5 * 60 * 1000
  const dateTime = new Date(Date.now() + milliseconds)

  const Completionist = () => <span>{$t('halving_succeed')}</span>

  // Renderer callback with condition
  const renderer = ({
    days,
    hours,
    minutes,
    seconds,
    milliseconds,
    completed
  }) => {
    if (completed) {
      // Render a completed state
      return <Completionist />
    } else {
      // Render a countdown
      return (
        <div className="columns is-mobile">
          <div
            className="column is-one-quarter-mobile"
            style={{
              fontSize: '2.4rem',
              textAlign: 'center',
              color: '#3F3F3F'
            }}
          >
            {days ? zeroPad(days) : '00'}
          </div>
          <div
            className="column is-one-quarter-mobile"
            style={{
              fontSize: '2.4rem',
              textAlign: 'center',
              color: '#3F3F3F'
            }}
          >
            {hours ? zeroPad(hours) : '00'}
          </div>
          <div
            className="column is-one-quarter-mobile"
            style={{
              fontSize: '2.4rem',
              textAlign: 'center',
              color: '#3F3F3F'
            }}
          >
            {minutes ? zeroPad(minutes) : '00'}
          </div>
          <div
            className="column is-one-quarter-mobile"
            style={{
              fontSize: '2.4rem',
              textAlign: 'center',
              color: '#3F3F3F'
            }}
          >
            {seconds ? zeroPad(seconds) : '00'}
          </div>
        </div>
      )
    }
  }

  return <Countdown date={dateTime} renderer={renderer} />
})

export default CountDown
