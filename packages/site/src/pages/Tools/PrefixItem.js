import React from 'react'
import hash from '../../assets/hash.svg'
export default function PrefixItem(props) {
  return (
    <li style={props.style}>
      <span style={{ marginLeft: '18px' }}>
        <img src={hash} style={{ width: '32px', height: '32px' }} />
      </span>
      <div style={{ marginLeft: '16px' }}>
        <div style={{ fontWeight: 'bold' }}>{props.prefix}</div>
        <div>{props.value}</div>
      </div>
    </li>
  )
}
