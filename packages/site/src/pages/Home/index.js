import React from 'react'
import BestBlocks from './BestBlocks'
import BestExtrinsics from './BestExtrinsics'

export default function Home() {
  return (
    <section className="blockTransaction">
      <div className="columns">
        <div className="column">
          <BestBlocks />
        </div>
        <div className="column">
          <BestExtrinsics />
        </div>
      </div>
    </section>
  )
}
