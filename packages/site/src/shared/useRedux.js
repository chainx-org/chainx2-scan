import { useState, useEffect, useCallback, useMemo } from 'react'
import shallowCompare from '../shared/shallowEqual'
import createStore, { createCommonReducer } from './createStore'

const store = createStore()

export default function useRedux(namespace, initState) {
  const state = useMemo(() => {
    let reduxState = store.getState()
    if (!reduxState[namespace]) {
      store.injectReducer(namespace, createCommonReducer(namespace, initState))
    }
    reduxState = store.getState()
    return reduxState[namespace]
  }, [namespace, store])

  const [data, setData] = useState(state)

  useEffect(() => {
    const unsubscribe = store.subscribe(() => {
      const state = store.getState()
      setData(predata => {
        // 浅比较，如果相等，则不改变对象的引用值，避免额外的渲染。
        if (shallowCompare(predata, state[namespace])) {
          return predata
        } else {
          return state[namespace]
        }
      })
    })
    return () => unsubscribe()
  }, [store, namespace])

  const setState = useCallback(
    payload => {
      store.dispatch({ type: `${namespace}/setState`, payload })
    },
    [namespace]
  )

  return [data, setState, store]
}
