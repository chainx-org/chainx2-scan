import React from 'react'
import BestBlocks from './BestBlocks'
import BestExtrinsics from './BestExtrinsics'
import DashBoard from './DashBoard'
import BtcStates from './BtcStates'
export default function Home() {
  return (
    <section className="blockTransaction">
      <DashBoard />
      <div className="columns">
        <div className="column">
          <BestBlocks />
        </div>
        <div className="column">
          <BestExtrinsics />
        </div>
      </div>
      <div className="columns">
        <div className="column">
          <BtcStates />
        </div>
      </div>
    </section>
  )
}
