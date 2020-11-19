import React from 'react'
import AntdTable from 'antd/lib/table'
import { ConfigProvider, Empty } from 'antd'
import zh_CN from 'antd/lib/locale-provider/zh_CN'
import en_US from 'antd/lib/locale-provider/en_US'
import { useSelector } from 'react-redux'
import { localeSelector } from '../store/reducers/settingsSlice'
import $t from '../locale'

export default function Table({ ..._props }) {
  const locale = useSelector(localeSelector)

  const props = {
    size: 'small',
    ..._props
  }
  const pagination = _props.pagination
    ? {
        size: 'small',
        showQuickJumper: true,
        itemRender: (current, type, originalElement) => {
          if (type === 'prev') {
            return <a className="btn-border">{$t('COMMON_PRE_PAGE')}</a>
          }
          if (type === 'jump-prev') {
            return <span onClick={e => e.stopPropagation()}>...</span>
          }
          if (type === 'next') {
            return <a className="btn-border">{$t('COMMON_NEXT_PAGE')}</a>
          }
          if (type === 'jump-next') {
            return <span onClick={e => e.stopPropagation()}>...</span>
          }
          return originalElement
        },
        showTotal: (total, range) => (
          <span className="nagtive">
            {$t('COMMON_TOTAL')} {total} {$t('COMMON_UNIT')}
          </span>
        ),
        ..._props.pagination
      }
    : false
  return (
    <ConfigProvider locale={locale === 'zh' ? zh_CN : en_US}>
      <AntdTable
        {...props}
        bordered={false}
        rowClassName={(record, index) => (index % 2 === 0 ? 'smoke' : '')}
        pagination={pagination}
        locale={{
          emptyText: props.loading ? (
            <Empty image={false} description={false} />
          ) : (
            <Empty />
          )
        }}
      />
    </ConfigProvider>
  )
}
