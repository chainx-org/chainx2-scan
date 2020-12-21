import React from 'react'

export default function PanelList(props) {
  const { dataSource = [] } = props
  return (
    <section className="panel panel-list">
      {dataSource.map((item, index) => (
          item ?
        <div className="panel-block panel-item" key={index}>
          <div className="panel-item__title">{item.label}</div>
          <div className="panel-item__content">{item.data}</div>
        </div> : null
      ))}
    </section>
  )
}
