import React from 'react'
import BestBlocks from './BestBlocks'
import BestExtrinsics from './BestExtrinsics'
import ChainStatus from './ChainStatus'
import BtcStates from './BtcStates'
import PowerDistribution from './PowerDistributton'
import BridgeBlock from './BridgeBlock'
export default function Home() {
  return (
    <section className="blockTransaction">
      <div className="columns">
        <div className="column">
          <ChainStatus />
        </div>
      </div>
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
        <div className="column">
          <PowerDistribution />
        </div>
      </div>
      <div className="columns">
        <div className="column">
          <BridgeBlock />
        </div>
      </div>
    </section>
  )
}
