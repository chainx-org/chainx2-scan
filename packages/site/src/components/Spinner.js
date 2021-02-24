import React from 'react'
import Loading from '../assets/loading.png'

export default function Spinner(props) {
  const { style } = props
  return (
    <div className="spinner-wrap">
      <img src={Loading} alt="loading" style={style} />
    </div>
  )
}
