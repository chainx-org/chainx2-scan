import React from 'react'
import { Route, Switch } from 'react-router'

import BlockDetail from './Detail'
import BlocksList from './List'
import ValidatorNodesList from './validatorNodes'
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
                {list === 'unsettled' && <BlocksList {...props} />}
                {list === 'btc_trustees' && <BlocksList {...props} />}
                {list === 'missed' && <BlocksList {...props} />}
              </div>
            </>
          )
        }}
      />
    </Switch>
  )
}
