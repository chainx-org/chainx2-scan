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
    }
  },
  reducers: {
    setValidators(state, action) {
      state.validators = action.payload
    },
    setUnsettledNodes(state, action) {
      state.unsettled = action.payload
    }
  }
})

export const { setValidators, setUnsettledNodes } = validatorsSlice.actions

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

export const validatorNodesSelector = state => state.validators.validators
export const unsettledNodesSelector = state => state.validators.unsettled

export default validatorsSlice.reducer
