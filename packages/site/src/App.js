import React, { useEffect } from 'react'
import { BrowserRouter as Router } from 'react-router-dom'
import Main from './Main'
import Header from './pages/Header'
import Footer from './pages/Footer'
import { useDispatch, useSelector } from 'react-redux'
import {
  fetchForeignAssetsInfo,
  fetchNativeAssetInfo
} from '@src/store/reducers/assetSlice'
import { localeSelector } from '@src/store/reducers/settingsSlice'

function App() {
  const dispatch = useDispatch()
  const { locale } = useSelector(localeSelector) || {}

  useEffect(() => {
    dispatch(fetchNativeAssetInfo())
    dispatch(fetchForeignAssetsInfo())
  }, [dispatch, locale])

  useEffect(() => {
    ReactGA.set({ page: window.location.pathname }) // Update the user's current page
    ReactGA.pageview(window.location.pathname + window.location.search)
  })

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
