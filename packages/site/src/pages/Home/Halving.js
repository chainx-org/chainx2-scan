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
    <section
      className="panel"
      // style={{ width: 417, marginBottom: '1.25rem' }}
    >
      <div className="panel-heading">{$t('halving_countdown')}</div>
      {data && currentIndex ? (
        <div className="panel-block py-5" style={{ minHeight: '100px' }}>
          <div
            className="columns"
            style={{
              width: '100%',
              textAlign: 'center',
              marginLeft: 'unset',
              marginRight: 'unset'
            }}
          >
            <div className="column is-one-quarter-desktop">
              <img src={halving} alt="halving" style={{ width: '5rem' }} />
              <h1 style={{ fontSize: '2.4rem', color: '#3F3F3F' }}>
                {halvingBlock || '0'}
              </h1>
              <h3 style={{ fontSize: '1rem', color: '#8E8E8E' }}>
                {$t('halving_left_blocks')}
              </h3>
            </div>

            <div className="column pt-5">
              <CountDown sessionIndex={currentIndex} />
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
              <div className="is-size-7  has-text-right">
                <a
                  href="https://www.chainxpcxhalving.com/"
                  className="has-text-success"
                  target="_blank"
                >
                  {$t('halving_community_edition')}
                </a>
              </div>
            </div>
          </div>
        </div>
      ) : (
        loading
      )}
    </section>
  )
}

export default Halving
