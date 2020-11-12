import React from 'react'
import BestBlocks from './BestBlocks'
import BestExtrinsics from './BestExtrinsics'
import ChainStatus from './ChainStatus'
import BtcStates from './BtcStates'
import PowerDistribution from './PowerDistributton'
import BridgeBlock from './BridgeBlock'
import InputSearch from '../../components/InputSearch'
export default function Home(props) {
  return (
    <section className="blockTransaction">
      <div className="columns is-hidden-desktop">
        <div className="column">
          <InputSearch {...props}/>
        </div>
      </div>
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
