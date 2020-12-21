import { createSlice } from '@reduxjs/toolkit'
import api from '../../services/api'
import { nonFunc } from '@src/utils'
import {setValidatorVotes} from "./validatorsSlice";

const accountSlice = createSlice({
  name: 'settings',
  initialState: {
    transfers: [],
    pairs: [],
    votes: {
      items: [],
      page: 0,
      pageSize: 10,
      total: 0
    },
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
    },
    deposits: {
      items: [],
      page: 0,
      pageSize: 10,
      total: 0
    },
    withdrawals: {
      items: [],
      page: 0,
      pageSize: 10,
      total: 0
    },
    runtime: {
      items: [],
      page: 0,
      pageSize: 10,
      total: 0
    },
    type: {
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
    },
    setDeposits(state, action) {
      state.deposits = action.payload
    },
    setWithdrawals(state, action) {
      state.withdrawals = action.payload
    },
    setRuntimeHistory(state, action) {
      state.runtime = action.payload
    },
    setType(state, action){
      state.type = action.payload
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
  setCashList,
  setDeposits,
  setWithdrawals,
  setRuntimeHistory,
  setType
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

export const fetchVotes = (address, setLoading = nonFunc) => async dispatch => {
  setLoading(true)
  try {
    const { result: votes } = await api.fetch(`/accounts/${address}/votes`)

    dispatch(
      setVotes(votes)
      /*
      setVotes(
        Object.entries(votes).map(([validator, value]) => {
          return {
            validator,
            ...value
          }
        })
      )
      */
    )
  } finally {
    setLoading(false)
  }
}

export const fetchExtrinsics = (
  address,
  page,
  pageSize,
  setLoading = nonFunc
) => async dispatch => {
  setLoading(true)
  try {
    const {
      result: extrinsics
    } = await api.fetch(`/accounts/${address}/extrinsics`, { page, pageSize })

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

export const fetchDeposits = (
  address,
  setLoading = nonFunc,
  page,
  pageSize
) => async dispatch => {
  setLoading(true)
  try {
    const { result: deposits } = await api.fetch(
      `/accounts/${address}/deposits`,
      {
        page,
        pageSize
      }
    )

    dispatch(setDeposits(deposits))
  } finally {
    setLoading(false)
  }
}

export const fetchRuntimeHistory = (
  setLoading = nonFunc,
  page,
  pageSize
) => async dispatch => {
  setLoading(true)
  try {
    const { result: runtime } = await api.fetch('/runtimeHistory', {
      page,
      pageSize
    })

    dispatch(setRuntimeHistory(runtime))
  } finally {
    setLoading(false)
  }
}

export const fetchWithdrawals = (
  address,
  setLoading = nonFunc,
  page,
  pageSize
) => async dispatch => {
  setLoading(true)
  try {
    const { result: withdrawals } = await api.fetch(
      `/accounts/${address}/withdrawals`,
      {
        page,
        pageSize
      }
    )

    dispatch(setWithdrawals(withdrawals))
  } finally {
    setLoading(false)
  }
}

export const fetchAccountType = (
    setLoading = nonFunc,
    address,
) => async dispatch => {
  setLoading(true)
  try {
    const { result: type } = await api.fetch(`/accountType/${address}`)
    dispatch(setType(type))
  } finally {
    setLoading(false)
  }
}

export const accountTypeSelector = state => state.accounts.type
export const transfersSelector = state => state.accounts.transfers
export const accountVotesSelector = state => state.accounts.votes
export const extrinsicsSelector = state => state.accounts.extrinsics
export const openOrdersSelector = state => state.accounts.openOrders
export const pairsSelector = state => state.accounts.pairs
export const dealsSelector = state => state.accounts.deals
export const depositsSelector = state => state.accounts.deposits
export const withdrawalsSelector = state => state.accounts.withdrawals
export const runtimeSelector = state => state.accounts.runtime

export default accountSlice.reducer
