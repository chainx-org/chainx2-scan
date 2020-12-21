import React, { useState, useEffect } from 'react'
import { Input, Select, Tooltip } from 'antd'
import BlockLink from '../../components/BlockLink'
import { Table, ValidatorLink } from '../../components'
import { encodeAddress } from '../../shared'
import DateShow from '../../components/DateShow'
import $t from '../../locale'
import {
  eventSearchSelector,
  extrinsicSearchSelector,
  fetchEventSearch,
  fetchExtrinsicSearch,
  NodeblockSelector
} from '../../store/reducers/validatorsSlice'
import { useDispatch, useSelector } from 'react-redux'
import TxLink from '../../components/TxLink'
import extrinsic from '../../locale/messages/extrinsic'
import { QuestionCircleOutlined } from '@ant-design/icons'
export default function Search() {
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(20)
  const [loading, setLoading] = useState(false)
  const [totalPage, settotalPage] = useState(0)
  const dispatch = useDispatch()
  const [kind, Setkind] = useState('event')
  const [search, SetSearch] = useState('')
  useEffect(() => {
    dispatch(fetchEventSearch(setLoading, search, page, pageSize))
  }, [search, page, pageSize, dispatch])

  const { data, total } = useSelector(eventSearchSelector) || []

  useEffect(() => {
    dispatch(fetchExtrinsicSearch(setLoading, search, page, pageSize))
  }, [search, page, pageSize, dispatch])

  const { items, totalnum } = useSelector(extrinsicSearchSelector) || []
  const width = document.documentElement.clientWidth
  const mobile = width < 1024
  let info
  if (data) {
    info = data
  } else {
    info = []
  }
  let extrinsic
  if (items) {
    extrinsic = items
  } else {
    extrinsic = []
  }
  function handleChange(value) {
    Setkind(value)
  }
  const { Search } = Input
  const { Option } = Select
  const onSearch = value => {
    SetSearch(value)
  }
  return (
    <div>
      <div style={{ display: 'flex' }}>
        <div>
          <span style={{ marginRight: 20 }}>{$t('search_type')}</span>
          <Select
            defaultValue="event"
            style={{ width: 400, marginBottom: 20 }}
            onChange={handleChange}
          >
            <Option value="event">event</Option>
            <Option value="extrinsic">extrinsic</Option>
          </Select>
        </div>
        <div
          style={{
            height: '32px',
            display: 'flex',
            alignItems: 'center',
            marginLeft: '20px'
          }}
        >
          <Tooltip
            title={
              '1.请先选择要搜索的类型：event 或者 extrinsic ， 然后在搜索框内输入关键字。 2.目前 event 支持 method 和section 查询 , extrinsic 支持 hash,name,section 查询。 3.如果表格为空，则没有查询结果。4.查询参数支持大小写模糊匹配'
            }
            placement={'bottom'}
          >
            <QuestionCircleOutlined />
            <span>{$t('help')}</span>
          </Tooltip>
        </div>
      </div>
      <Search
        placeholder={$t('search_before')}
        allowClear
        enterButton={$t('search')}
        size="large"
        onSearch={onSearch}
      />
      {kind === 'event' ? (
        <Table
          style={{ marginTop: 20 }}
          loading={loading}
          onChange={({ current, pageSize: size }) => {
            setPage(current)
            setPageSize(size)
          }}
          pagination={{ current: page, pageSize, total }}
          scroll={{
            x: '100vh'
          }}
          expandedRowRender={data => {
            return (
              <div>
                <pre style={{ textAlign: 'left' }}>
                  {JSON.stringify(data.data.props, null, 2)}
                </pre>
              </div>
            )
          }}
          dataSource={info.map(item => {
            return {
              key: item._id,
              block_height: <BlockLink value={item.indexer.blockHeight} />,
              block_time: <DateShow value={item.indexer.blockTime} />,
              ex_hash: (
                <TxLink
                  style={{ width: 136 }}
                  className="text-truncate"
                  value={item.extrinsicHash}
                />
              ),
              common_module: <div>{$t(item.section)}</div>,
              common_result: <div>{$t(item.method)}</div>,
              data: <div>{JSON.stringify(item.data)}</div>
            }
          })}
          columns={[
            {
              title: $t('block_height'),
              dataIndex: 'block_height'
            },
            {
              title: $t('block_time'),
              dataIndex: 'block_time'
            },
            {
              title: $t('ex_hash'),
              dataIndex: 'ex_hash'
            },
            {
              title: $t('common_module'),
              dataIndex: 'common_module'
            },
            {
              title: $t('common_result'),
              dataIndex: 'common_result'
            }
          ]}
        />
      ) : (
        <Table
          style={{ marginTop: 20 }}
          loading={loading}
          onChange={({ current, pageSize: size }) => {
            setPage(current)
            setPageSize(size)
          }}
          pagination={{ current: page, pageSize, total: totalnum }}
          scroll={{
            x: '100vh'
          }}
          expandedRowRender={data => {
            console.log(data)
            return (
              <div>
                <pre style={{ textAlign: 'left' }}>
                  {JSON.stringify(data.data.props, null, 2)}
                </pre>
              </div>
            )
          }}
          dataSource={extrinsic.map(item => {
            return {
              key: item._id,
              block_height: <BlockLink value={item.indexer.blockHeight} />,
              block_time: <DateShow value={item.indexer.blockTime} />,
              hash: (
                <TxLink
                  style={{ width: 136 }}
                  className="text-truncate"
                  value={item.hash}
                />
              ),
              common_module: <div>{$t(item.section)}</div>,
              common_result: <div>{$t(item.method)}</div>,
              data: <div>{item.data}</div>
            }
          })}
          columns={[
            {
              title: $t('block_height'),
              dataIndex: 'block_height'
            },
            {
              title: $t('block_time'),
              dataIndex: 'block_time'
            },
            {
              title: $t('hash'),
              dataIndex: 'hash'
            },
            {
              title: $t('common_module'),
              dataIndex: 'common_module'
            }
          ]}
        />
      )}
    </div>
  )
}
