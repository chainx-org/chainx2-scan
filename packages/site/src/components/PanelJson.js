import React from 'react'

export default function({ json }) {
  return (
    <pre
      style={{
        textAlign: 'left',
        backgroundColor: 'unset',
        padding: 0,
        color: '#959595'
      }}
    >
      {JSON.stringify(json, null, 2)}
    </pre>
  )
}
