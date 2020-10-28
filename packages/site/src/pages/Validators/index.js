import React from 'react'
import { Route, Switch } from 'react-router'

import ValidatorNodesList from './validatorNodes'
import UnsettledNodesList from './unsettledNodes'
import TrusteeNodesList from './trusteeNodes'
import ValidatorsNav from '../../components/ValidatorsNav'

export default function Validators() {
  return (
    <Switch>
      <Route
        path="/validators/:list?"
        render={props => {
          const {
            match: {
              params: { list }
            }
          } = props
          return (
            <>
              <div className="box">
                <ValidatorsNav activeKey={list} />
                {(!list || list === 'validators') && (
                  <ValidatorNodesList {...props} />
                )}
                {list === 'unsettled' && <UnsettledNodesList {...props} />}
                {list === 'btc_trustees' && <TrusteeNodesList {...props} />}
              </div>
            </>
          )
        }}
      />
    </Switch>
  )
}
