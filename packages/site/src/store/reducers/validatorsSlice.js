import { createSlice } from '@reduxjs/toolkit'
import api from '../../services/api'
import { nonFunc } from '@src/utils'

const validatorsSlice = createSlice({
  name: 'validators',
  initialState: {
    validators: {
      items: [],
      page: 0,
      pageSize: 10,
      total: 0
    },
    unsettled: {
      items: [],
      page: 0,
      pageSize: 10,
      total: 0
    },
    trustees: {
      items: [],
      page: 0,
      pageSize: 10,
      total: 0
    },
    missed: {
      items: [],
      page: 0,
      pageSize: 10,
      total: 0
    },
    blocknum: {
      items: [],
      page: 0,
      pageSize: 10,
      total: 0
    },
    info:{
      items: [],
      page: 0,
      pageSize: 10,
      total: 0
    },
    unitmissed:{
      items: [],
      page: 0,
      pageSize: 10,
      total: 0
    }
  },
  reducers: {
    setValidators(state, action) {
      state.validators = action.payload
    },
    setUnsettledNodes(state, action) {
      state.unsettled = action.payload
    },
    setTrusteeNodes(state, action) {
      state.trustees = action.payload
    },
    setMissed(state, action) {
      state.missed = action.payload
    },
    setBlockNum(state, action) {
      state.blocknum = action.payload
    },
    setValidatorInfo(state, action){
      state.info = action.payload
    },
    setUnitMissed(state, action){
      state.unitmissed = action.payload
    }
  }
})

export const {
  setValidators,
  setUnsettledNodes,
  setTrusteeNodes,
  setMissed,
  setBlockNum,
  setValidatorInfo,
  setUnitMissed
} = validatorsSlice.actions

export const fetchValidatorNodes = (
  setLoading = nonFunc,
  page,
  pageSize
) => async dispatch => {
  setLoading(true)
  try {
    const { result: validators } = await api.fetch(`/validators`, {
      page,
      pageSize
    })

    dispatch(setValidators(validators))
  } finally {
    setLoading(false)
  }
}

export const fetchValidator = (
    setLoading = nonFunc,
    page,
    pageSize
) => async dispatch => {
  setLoading(true)
  try {
    const { result: info } = await api.fetch(`/validators/all`, {
      page,
      pageSize
    })

    dispatch(setValidatorInfo(info))
  } finally {
    setLoading(false)
  }
}

export const fetchUnsettledNodes = (
  setLoading = nonFunc,
  page,
  pageSize
) => async dispatch => {
  setLoading(true)
  try {
    const { result: unsettled } = await api.fetch(`/unsettled`, {
      page,
      pageSize
    })

    dispatch(setUnsettledNodes(unsettled))
  } finally {
    setLoading(false)
  }
}

export const fetchTrusteeNodes = (
  setLoading = nonFunc,
  page,
  pageSize
) => async dispatch => {
  setLoading(true)
  try {
    const { result: trustees } = await api.fetch(`/trustees`, {
      page,
      pageSize
    })

    dispatch(setTrusteeNodes(trustees))
  } finally {
    setLoading(false)
  }
}

export const fetchMissed = (
  setLoading = nonFunc,
  page,
  pageSize
) => async dispatch => {
  setLoading(true)
  try {
    const { result: missed } = await api.fetch(`/missed`, {
      page,
      pageSize
    })

    dispatch(setMissed(missed))
  } finally {
    setLoading(false)
  }
}

export const fetchUnitMissed = (
    setLoading = nonFunc,
    params,
    page,
    pageSize
) => async dispatch => {
  setLoading(true)
  try {
    const { result: unitmissed } = await api.fetch(`/unitmissed/${params}`, {
      page,
      pageSize
    })

    dispatch(setUnitMissed(unitmissed))
  } finally {
    setLoading(false)
  }
}

export const fetchblockNum = (
    setLoading = nonFunc,
    hash,
    page,
    pageSize
) => async dispatch => {
  setLoading(true)
  try {
    const { result: num } = await api.fetch(`/blocknum/${hash}`, {
      page,
      pageSize
    })

    dispatch(setBlockNum(num))
  } finally {
    setLoading(false)
  }
}
export const UnitMiseedSelector = state=> state.validators.unitmissed
export const ValidatorInfoSelector = state=> state.validators.info
export const BlockNumSelector = state=> state.validators.blocknum
export const MissedSelector = state => state.validators.missed
export const validatorNodesSelector = state => state.validators.validators
export const unsettledNodesSelector = state => state.validators.unsettled
export const trusteeNodesSelector = state => state.validators.trustees

export default validatorsSlice.reducer
