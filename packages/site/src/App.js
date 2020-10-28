import React, { useEffect } from 'react'
import { BrowserRouter as Router } from 'react-router-dom'
import Main from './Main'
import Header from './pages/Header'
import Footer from './pages/Footer'
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
  }, [dispatch])

  return (
    <Router>
      <React.Fragment>
        <Header />
        <Main />
        <Footer />
      </React.Fragment>
    </Router>
  )
}

export default App
