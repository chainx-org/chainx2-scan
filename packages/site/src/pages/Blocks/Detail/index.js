import React from 'react'
import Breadcrumb from '../../../components/Breadcrumb'
import $t from '../../../locale'

export default function() {
  const breadcrumb = (
    <Breadcrumb
      dataSource={[
        { to: '/blocks', label: $t('block_list') },
        { label: $t('block_detail') }
      ]}
    />
  )

  return <div>{breadcrumb}</div>
}
