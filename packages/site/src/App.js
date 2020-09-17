import React, { useEffect } from 'react'
import { BrowserRouter as Router } from 'react-router-dom'
import Main from './Main'
import Header from './pages/Header'
import { useDispatch } from 'react-redux'
import {
  fetchForeignAssetsInfo,
  fetchNativeAssetInfo
} from '@src/store/reducers/assetSlice'

function App() {
  const dispatch = useDispatch()
  useEffect(() => {
    dispatch(fetchNativeAssetInfo())
    dispatch(fetchForeignAssetsInfo())
  }, [])

  return (
    <Router>
      <React.Fragment>
        <Header />
        <Main />
      </React.Fragment>
    </Router>
  )
}

export default App
