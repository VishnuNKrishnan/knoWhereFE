// The Component that renders the home screen upon loading the app
import React, { useContext } from 'react'
import { UserContext } from '../userContext'
import AppDashboard from './AppDashboard'
import ChooseVehicleToTrack from './ChooseVehicleToTrack'
import './HomeScreen.css'
import HomeScreenBEVMap from './HomeScreenBEVMap'
import TrackOne from './TrackOne'

function HomeScreen(props) {
  //Setting the context values...
  const {
    loggedInAccountId,
    setLoggedInAccountId,
    currentVehicleId,
    homeScreenCurrentScreen,
    setHomeScreenCurrentScreen,
    dashboardCurrentScreen,
    setDashboardCurrentScreen,
    dataFromDate,
    dataToDate,
    hasTravelledOnDate,
    setHasTravelledOnDate,
  } = useContext(UserContext)
  return (
    <div className="HomeScreenWrapper">
      {/* <ChooseVehicleToTrack /> */}
      {/* <HomeScreenBEVMap /> */}

      {homeScreenCurrentScreen == 'trackOne' ? <TrackOne /> : null}
      {homeScreenCurrentScreen == 'appDashboard' ? <AppDashboard /> : null}
    </div>
  )
}

export default HomeScreen
