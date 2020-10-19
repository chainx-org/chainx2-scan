import { createSlice } from '@reduxjs/toolkit'
import api from '../../services/api'
import { nonFunc } from '@src/utils'

const crossBlocksSlice = createSlice({
  name: 'crossblocks',
  initialState: {
    transfers: [],
    votes: [],
    pairs: [],
    crossblocks: {
      items: [],
      page: 0,
      pageSize: 10,
      total: 0
    },
    crosstransactions: {
      items: [],
      page: 0,
      pageSize: 10,
      total: 0
    },
    crossdeposits: {
      items: [],
      page: 0,
      pageSize: 10,
      total: 0
    }
  },
  reducers: {
    setCrossBlocks(state, action) {
      state.crossblocks = action.payload
    },
    setCrossTransactions(state, action) {
      state.crosstransactions = action.payload
    },
    setCrossDeposits(state, action) {
      state.crossdeposits = action.payload
    }
    /*
    setVotes(state, action) {
      state.votes = action.payload
    },
    setExtrinsics(state, action) {
      state.extrinsics = action.payload
    },
    setOpenOrders(state, action) {
      state.openOrders = action.payload
    },
    setPairs(state, action) {
      state.pairs = action.payload
    },
    setDeals(state, action) {
      state.deals = action.payload
    }
    */
  }
})

export const {
  setCrossBlocks,
  setCrossTransactions,
  setCrossDeposits
  /*
  setVotes,
  setExtrinsics,
  setOpenOrders,
  setPairs,
  setDeals
  */
} = crossBlocksSlice.actions

/*
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

export const fetchExtrinsics = (
  address,
  setLoading = nonFunc
) => async dispatch => {
  setLoading(true)
  try {
    const { result: extrinsics } = await api.fetch(
      `/accounts/${address}/extrinsics`
    )

    dispatch(setExtrinsics(extrinsics))
  } finally {
    setLoading(false)
  }
}

export const fetchOpenOrders = (
  address,
  setLoading = nonFunc,
  page,
  pageSize
) => async dispatch => {
  setLoading(true)
  try {
    const {
      result: openOrders
    } = await api.fetch(`/accounts/${address}/open_orders`, { page, pageSize })

    dispatch(setOpenOrders(openOrders))
  } finally {
    setLoading(false)
  }
}

export const fetchPairs = () => async dispatch => {
  const { result: pairs } = await api.fetch('/dex/pairs')
  dispatch(setPairs(pairs))
}

export const fetchDeals = (
  address,
  setLoading = nonFunc,
  page,
  pageSize
) => async dispatch => {
  setLoading(true)
  try {
    const { result: deals } = await api.fetch(`/accounts/${address}/deals`, {
      page,
      pageSize
    })

    dispatch(setDeals(deals))
  } finally {
    setLoading(false)
  }
}
*/

export const fetchCrossBlocks = (
  setLoading = nonFunc,
  page,
  pageSize
) => async dispatch => {
  setLoading(true)
  try {
    const { result: crossblocks } = await api.fetch(
      `/crossblocks/bitcoin/blocks`,
      {
        page,
        pageSize
      }
    )

    dispatch(setCrossBlocks(crossblocks))
  } finally {
    setLoading(false)
  }
}

export const fetchCrossTransactions = (
  setLoading = nonFunc,
  page,
  pageSize
) => async dispatch => {
  setLoading(true)
  try {
    const { result: crosstransactions } = await api.fetch(
      `/crossblocks/bitcoin/crosstx`,
      {
        page,
        pageSize
      }
    )

    dispatch(setCrossTransactions(crosstransactions))
  } finally {
    setLoading(false)
  }
}

export const fetchCrossDeposits = (
  setLoading = nonFunc,
  page,
  pageSize
) => async dispatch => {
  setLoading(true)
  try {
    const { result: crossdeposits } = await api.fetch(
      `/crossblocks/bitcoin/deposits`,
      {
        page,
        pageSize
      }
    )

    dispatch(setCrossDeposits(crossdeposits))
  } finally {
    setLoading(false)
  }
}

/*
export const transfersSelector = state => state.accounts.transfers
export const accountVotesSelector = state => state.accounts.votes
export const extrinsicsSelector = state => state.accounts.extrinsics
export const openOrdersSelector = state => state.accounts.openOrders
export const pairsSelector = state => state.accounts.pairs
export const dealsSelector = state => state.accounts.deals
*/
export const crossBlocksSelector = state => state.crossblocks.crossblocks
export const crossTransactionsSelector = state =>
  state.crossblocks.crosstransactions
export const crossDepositsSelector = state => state.crossblocks.crossdeposits

export default crossBlocksSlice.reducer
