import { createSelector, createSlice } from '@reduxjs/toolkit'
import api from '@src/services/api'

const emptyPageInfo = {
  items: [],
  page: 0,
  pageSize: 10,
  total: 0
}

const dexSlice = createSlice({
  name: 'dex',
  initialState: {
    pairs: [],
    tradingPairs: {},
    activePair: null,
    openOrders: emptyPageInfo,
    fills: emptyPageInfo,
    depth: {
      asks: [],
      bids: []
    }
  },
  reducers: {
    setTrading(state, action) {
      state.trandingPairs = action.payload
    },
    setPairs(state, action) {
      state.pairs = action.payload
      state.activePair = state.pairs[0]
    },
    setActivePair(state, action) {
      state.activePair = action.payload
    },
    setOpenOrders(state, action) {
      state.openOrders = action.payload
    },
    setFills(state, action) {
      state.fills = action.payload
    },
    setDepth(state, action) {
      state.depth = action.payload
    }
  }
})

const {
  setPairs,
  setOpenOrders,
  setFills,
  setDepth,
  setTrading
} = dexSlice.actions

export const fetchPairs = () => async dispatch => {
  const { result: pairs } = await api.fetch('/dex/pairs')
  dispatch(setPairs(pairs))
}

export const fetchTradingPairs = () => async dispatch => {
  const { result: tradingPairs } = await api.fetch('/dex/tradingpairs')
  dispatch(setTrading(tradingPairs))
}

export const fetchOpenOrders = (
  pairId,
  page = 0,
  pageSize = 10
) => async dispatch => {
  const { result } = await api.fetch(`/dex/open_orders/${pairId}`, {
    page,
    pageSize
  })
  dispatch(setOpenOrders(result))
}

export const fetchFills = (
  pairId,
  page = 0,
  pageSize = 10
) => async dispatch => {
  const { result } = await api.fetch(`/dex/fills/${pairId}`, {
    page,
    pageSize
  })

  dispatch(setFills(result))
}

export const fetchDepth = (pairId, cnt = 6) => async dispatch => {
  const { result } = await api.fetch(`/dex/depth/${pairId}`, { cnt })

  dispatch(setDepth(result))
}

export const pairsSelector = state => state.dex.pairs
export const tradingPairsSelector = state => state.dex.tradingPairs
export const activePairSelector = state => state.dex.activePair
export const openOrdersSelector = state => state.dex.openOrders
export const fillsSelector = state => state.dex.fills
export const depthSelector = state => state.dex.depth
export const normalizedDepthSelector = createSelector(
  depthSelector,
  ({ asks, bids }) => {
    let total = 0
    const nAsks = asks
      .slice()
      .reverse()
      .map(ask => {
        total += ask.amount

        return { ...ask, total }
      })
      .reverse()

    total = 0
    const nBids = bids.map(bid => {
      total += bid.amount

      return { ...bid, total }
    })

    return {
      asks: nAsks,
      bids: nBids
    }
  }
)

export default dexSlice.reducer
