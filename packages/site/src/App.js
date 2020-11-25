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
import ReactGA from 'react-ga'
import { createBrowserHistory } from 'history'

function App() {
  const dispatch = useDispatch()
  const { locale } = useSelector(localeSelector) || {}

  useEffect(() => {
    dispatch(fetchNativeAssetInfo())
    dispatch(fetchForeignAssetsInfo())
  }, [dispatch, locale])

  const history = createBrowserHistory()

  // Initialize google analytics page view tracking
  history.listen(location => {
    ReactGA.initialize('G-CSRS4R2T7N')
    ReactGA.set({ page: location.pathname }) // Update the user's current page
    ReactGA.pageview(location.pathname) // Record a pageview for the given page
  })

  return (
    <Router history={history}>
      <React.Fragment>
        <Header />
        <Main />
        <Footer />
      </React.Fragment>
    </Router>
  )
}

export default App
