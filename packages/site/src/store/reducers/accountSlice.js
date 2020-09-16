import { createSlice } from '@reduxjs/toolkit'
import api from '../../services/api'
import { nonFunc } from '@src/utils'

const accountSlice = createSlice({
  name: 'settings',
  initialState: {
    transfers: [],
    votes: []
  },
  reducers: {
    setTransfers(state, action) {
      state.transfers = action.payload
    },
    setVotes(state, action) {
      state.votes = action.payload
    }
  }
})

export const { setTransfers, setVotes } = accountSlice.actions

export const fetchTransfers = (
  address,
  params,
  setLoading = nonFunc
) => async dispatch => {
  setLoading(true)
  try {
    const { result: transfers } = await api.fetch(
      `/accounts/${address}/transfers`,
      params
    )
    dispatch(setTransfers(transfers))
  } finally {
    setLoading(false)
  }
}

export const fetchVotes = (address, setLoading = nonFunc) => async dispatch => {
  setLoading(true)
  try {
    const { result: votes } = await api.fetch(`/accounts/${address}/votes`)

    dispatch(
      setVotes(
        Object.entries(votes).map(([validator, value]) => {
          return {
            validator,
            ...value
          }
        })
      )
    )
  } finally {
    setLoading(false)
  }
}

export const transfersSelector = state => state.accounts.transfers
export const accountVotesSelector = state => state.accounts.votes

export default accountSlice.reducer
