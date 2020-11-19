import React from 'react'
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
const PowerDistributton = function() {
  const data = [
    {
      type: 'X-BTC',
      value: 0.011
    },
    {
      type: 'PolkaX',
      value: 0.2
    },
    {
      type: 'TR',
      value: 0.213
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
