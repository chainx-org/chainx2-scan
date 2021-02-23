import React, { useEffect, useMemo, useState } from 'react'
import Countdown, { zeroPad } from 'react-countdown'
import $t from '../../locale'
import halving from '../../assets/halving.png'
import { useDispatch, useSelector, shallowEqual } from 'react-redux'
import { latestChainStatusSelector } from '../../store/reducers/latestChainStatusSlice'

const CountDown = function() {
  const data = useSelector(latestChainStatusSelector) || {}

  const currentIndex = parseInt(data.current_index)
  const currentFinalized = parseInt(data.finalized)
  const halvingIndex = 55533
  const halvingBlock = 55533 * 50 - currentFinalized
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
            {days ? zeroPad(days) : ''}
          </div>
          <div
            className="column is-one-quarter-mobile"
            style={{
              fontSize: '2.4rem',
              textAlign: 'center',
              color: '#3F3F3F'
            }}
          >
            {hours ? zeroPad(hours) : ''}
          </div>
          <div
            className="column is-one-quarter-mobile"
            style={{
              fontSize: '2.4rem',
              textAlign: 'center',
              color: '#3F3F3F'
            }}
          >
            {minutes ? zeroPad(minutes) : ''}
          </div>
          <div
            className="column is-one-quarter-mobile"
            style={{
              fontSize: '2.4rem',
              textAlign: 'center',
              color: '#3F3F3F'
            }}
          >
            {seconds ? zeroPad(seconds) : ''}
          </div>
        </div>
      )
    }
  }

  return (
    <section
      className="panel"
      // style={{ width: 417, marginBottom: '1.25rem' }}
    >
      <div className="panel-heading">{$t('halving_countdown')}</div>
      <div className="panel-block py-5">
        <div className="columns" style={{ width: '100%', textAlign: 'center' }}>
          <div className="column is-one-quarter-desktop">
            <img src={halving} alt="halving" style={{ width: '5rem' }} />
            <h1 style={{ fontSize: '2.4rem', color: '#3F3F3F' }}>
              {halvingBlock || ''}
            </h1>
            <h3 style={{ fontSize: '1rem', color: '#8E8E8E' }}>
              {$t('halving_left_blocks')}
            </h3>
          </div>
          <div className="column pt-5">
            <Countdown date={dateTime} renderer={renderer} />
            <div className="columns is-mobile">
              <span
                className="column is-one-quarter-mobile"
                style={{
                  fontSize: '1rem',
                  textAlign: 'center',
                  color: '#8E8E8E'
                }}
              >
                {$t('day')}
              </span>
              <span
                className="column is-one-quarter-mobile"
                style={{
                  fontSize: '1rem',
                  textAlign: 'center',
                  color: '#8E8E8E'
                }}
              >
                {$t('hour')}
              </span>
              <span
                className="column is-one-quarter-mobile"
                style={{
                  fontSize: '1rem',
                  textAlign: 'center',
                  color: '#8E8E8E'
                }}
              >
                {$t('minute')}
              </span>
              <span
                className="column is-one-quarter-mobile"
                style={{
                  fontSize: '1rem',
                  textAlign: 'center',
                  color: '#8E8E8E'
                }}
              >
                {$t('seconds')}
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default CountDown
