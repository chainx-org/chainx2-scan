import { createSlice } from '@reduxjs/toolkit'
import api from '../../services/api'
import { nonFunc } from '@src/utils'

const accountSlice = createSlice({
  name: 'settings',
  initialState: {
    transfers: [],
    votes: [],
    pairs: [],
    extrinsics: {
      items: [],
      page: 0,
      pageSize: 10,
      total: 0
    },
    openOrders: {
      items: [],
      page: 0,
      pageSize: 10,
      total: 0
    },
    deals: {
      items: [],
      page: 0,
      pageSize: 10,
      total: 0
    }
  },
  reducers: {
    setTransfers(state, action) {
      state.transfers = action.payload
    },
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
    },
    setCharges(state, action) {
      state.charges = action.payload
    },
    setCashList(state, action) {
      state.cash = action.payload
    }
  }
})

export const {
  setTransfers,
  setVotes,
  setExtrinsics,
  setOpenOrders,
  setPairs,
  setDeals,
  setCharges,
  setCashList
} = accountSlice.actions

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

export const fetchCharges = (
  address,
  params,
  setLoading = nonFunc
) => async dispatch => {
  setLoading(true)
  try {
    const { result: charges } = await api.fetch(
      `/accounts/${address}/charges`,
      params
    )
    dispatch(setCharges(charges))
  } finally {
    setLoading(false)
  }
}

export const fetchCashList = (
  address,
  params,
  setLoading = nonFunc
) => async dispatch => {
  setLoading(true)
  try {
    const { result: cashList } = await api.fetch(
      `/accounts/${address}/cashList`,
      params
    )
    dispatch(setCashList(cashList))
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

export const transfersSelector = state => state.accounts.transfers
export const accountVotesSelector = state => state.accounts.votes
export const extrinsicsSelector = state => state.accounts.extrinsics
export const openOrdersSelector = state => state.accounts.openOrders
export const pairsSelector = state => state.accounts.pairs
export const dealsSelector = state => state.accounts.deals

export default accountSlice.reducer
