import React, { useEffect, useMemo, useState } from 'react'
import $t from '../../locale'
import {
  Chart,
  registerShape,
  Geom,
  Axis,
  Tooltip,
  Interval,
  Interaction,
  Coordinate,
  Guide
} from 'bizcharts'
import { useDispatch, useSelector, shallowEqual } from 'react-redux'
import {
  crossDepositMineSelector,
  fetchDepositMine
} from '../../store/reducers/crossBlocksSlice'
import { latestChainStatusSelector } from '../../store/reducers/latestChainStatusSlice'
const PowerDistributton = function() {
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(20)
  const [loading, setLoading] = useState(false)

  const dispatch = useDispatch()
  // BTC 数量
  let Xbtcshare = 0
  useEffect(() => {
    dispatch(fetchDepositMine(setLoading, page - 1, pageSize))
  }, [dispatch, page, pageSize])
  let { items } = useSelector(crossDepositMineSelector, shallowEqual) || {}
  items = useMemo(() => {
    return items
  }, [items])
  let info = items ? items[0] : {}
  //BTC数量
  let btcBalance = 0
  try {
    btcBalance = info.balance.Usable / 100000000
  } catch (e) {
    btcBalance = 0
  }
  let PCXdata = useSelector(latestChainStatusSelector, shallowEqual) || {}
  PCXdata = useMemo(() => {
    return PCXdata
  }, [PCXdata])
  // 节点抵押总数
  let totalValidatorBonded = PCXdata.totalValidatorBonded / 100000000
  // 用户投票总数
  let totalVote = PCXdata.totalNominationSum / 100000000
  let pcxPower = totalValidatorBonded + totalVote
  //X-BTC奖励构成
  let Xbtc = (((400 * btcBalance) / pcxPower) * 28.8) / 50
  if (Xbtc) {
    Xbtcshare = Xbtc.toFixed(4)
  }
  const data = [
    {
      type: 'X-BTC',
      value: parseFloat(Xbtcshare)
    },
    {
      type: 'TR',
      value: 1 - 0.2 - 0.576 - parseFloat(Xbtcshare)
    },
    {
      type: 'PCX',
      value: 0.576
    }
  ]

  const sliceNumber = 0
  registerShape('interval', 'sliceShape', {
    draw(cfg, container) {
      const points = cfg.points
      let path = []
      path.push(['M', points[0].x, points[0].y])
      path.push(['L', points[1].x, points[1].y - sliceNumber])
      path.push(['L', points[2].x, points[2].y - sliceNumber])
      path.push(['L', points[3].x, points[3].y])
      path.push('Z')
      path = this.parsePath(path)
      return container.addShape('path', {
        attrs: {
          fill: cfg.color,
          path: path
        }
      })
    }
  })
  registerShape('interval', 'sliceShape', {
    draw(cfg, container) {
      const points = cfg.points
      let path = []
      path.push(['M', points[0].x, points[0].y])
      path.push(['L', points[1].x, points[1].y - sliceNumber])
      path.push(['L', points[2].x, points[2].y - sliceNumber])
      path.push(['L', points[3].x, points[3].y])
      path.push('Z')
      path = this.parsePath(path)
      return container.addShape('path', {
        attrs: {
          fill: cfg.color,
          path: path
        }
      })
    }
  })

  return (
    <section
      className="panel"
      // style={{ width: 417, marginBottom: '1.25rem' }}
    >
      <div className="panel-heading">{$t('power_distributton')}</div>
      <div className="panel-block">
        <Chart data={data} height={250} autoFit animate={false}>
          <Coordinate type="theta" radius={0.8} innerRadius={0.75} />
          <Axis visible={false} />
          <Tooltip showTitle={false} visible={false} />
          <Guide>
            <Guide.Text
              top={true}
              content={$t('mining_distribution')}
              style={{
                fill: '#000',
                fontSize: '16',
                textAlign: 'center',
                width: '400'
              }}
              offsetY={60}
            />
          </Guide>
          <Interval
            adjust="stack"
            position="value"
            color="type"
            shape="sliceShape"
            label={[
              '*',
              {
                content: data => {
                  return `${data.type}: ${(data.value * 100).toFixed(1)}%`
                }
              }
            ]}
          />
          <Interaction type="element-single-selected" />
        </Chart>
      </div>
    </section>
  )
}

export default PowerDistributton
