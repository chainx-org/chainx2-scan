import React from 'react'
import Loading from '../assets/loading.gif'

export default function Spinner() {
  return (
    <div className="spinner-wrap">
      <img src={Loading} alt="loading" />
    </div>
  )
}
