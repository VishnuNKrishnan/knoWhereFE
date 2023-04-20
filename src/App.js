import { useEffect, useState } from 'react'
import './App.css'
import HomeScreen from './components/HomeScreen'
import LoginScreen from './components/LoginScreen'
import { Route, BrowserRouter as Router } from 'react-router-dom'
import { UserContext } from './userContext'
import dateStringToTimestamp from './customModules/dateStringToTimestamp'
import getWeekDayLabel from './customModules/getWeekDayLabel'
import timestampToDateString from './customModules/timestampToDateString'
import isToday from './customModules/isToday'
import TrackOne from './components/TrackOne'

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [loggedInAccountId, setLoggedInAccountId] = useState('')
  //const [currentVehicleId, setCurrentVehicleId] = useState('WCQ-975-BCQ-080')
  const [currentVehicleId, setCurrentVehicleId] = useState('')
  const [detailedInfoToggleStatus, setDetailedInfoToggleStatus] = useState(
    false,
  )
  const [isGuestTracker, setIsGuestTracker] = useState(false) //For users using Tracking ID

  //--------------------
  // Setting Date Values
  //--------------------

  const today = Date.now()
  const todayDateString = timestampToDateString(today) //'2022-5-02'
  //console.log(todayDateString)

  //Set the start date of the journey of which details are required
  var startTimestamp = dateStringToTimestamp(todayDateString, 'current')
  //Set the end date of the journey of which details are required
  var endTimestamp = dateStringToTimestamp(todayDateString, 'next')

  const [dataFromDate, setDataFromDate] = useState(startTimestamp) //Used to set the date FROM which data will be pulled
  const [dataFromDayLabel, setDataFromDayLabel] = useState(
    getWeekDayLabel(todayDateString, 'current'),
  )
  const [dataToDate, setDataToDate] = useState(endTimestamp) //Used to set the date TILL which data will be pulled
  const [dataToDayLabel, setDataToDayLabel] = useState(
    getWeekDayLabel(todayDateString, 'next'),
  )

  const [hasTravelledOnDate, setHasTravelledOnDate] = useState(false) //Used to show or hide the map based on whether the vehicle has travelled on the selected date
  const [liveMode, setLiveMode] = useState(true) //TRUE if the timestamp of the current moment falls in between dataFromDate and dataToDate

  //------------------
  // DATE VALUES SET
  //------------------

  useEffect(() => {
    if (Date.now() >= dataFromDate && Date.now() <= dataToDate) {
      //If the timestamp of NOW (the current moment) falls between dataToDate and dataFromDate
      setLiveMode(true)
    } else {
      setLiveMode(false)
    }
    // console.log(liveMode)
    // console.log(dataFromDate)
    // console.log(today)
    // console.log(dataToDate)
  }, [dataFromDate, dataToDate])

  //--------------------------------------------
  // SETTING VARIABLES TO CONTROL SCREEN CONTENT
  //--------------------------------------------

  const [dashboardCurrentScreen, setDashboardCurrentScreen] = useState(
    'welcomeScreen',
  ) //Used to switch screens(components) WITHIN THE APPDASHBOARD.JSX component.
  //ACCEPTED VALUES:
  // 1) welcomeScreen
  // 2) trackOne
  // 3) linkNewVehicle

  const [homeScreenCurrentScreen, setHomeScreenCurrentScreen] = useState(
    'appDashboard',
  ) //Used to switch screens(components) WITHIN THE HOMESCREEN.JSX component.
  //ACCEPTED VALUES:
  // 1) appDashboard
  // 2) trackOne (Mounts the TrackOne.jsx component - to track a vehicle on the map)

  return (
    <Router>
      <div className="App">
        <UserContext.Provider
          value={{
            isLoggedIn,
            setIsLoggedIn,
            isGuestTracker,
            setIsGuestTracker,
            loggedInAccountId,
            setLoggedInAccountId,
            currentVehicleId,
            setCurrentVehicleId,
            homeScreenCurrentScreen,
            setHomeScreenCurrentScreen,
            dashboardCurrentScreen,
            setDashboardCurrentScreen,
            dataFromDate,
            setDataFromDate,
            dataToDate,
            setDataToDate,
            dataFromDayLabel,
            setDataFromDayLabel,
            dataToDayLabel,
            setDataToDayLabel,
            hasTravelledOnDate,
            setHasTravelledOnDate,
            detailedInfoToggleStatus,
            setDetailedInfoToggleStatus,
          }}
        >
          {/* {isLoggedIn ? <HomeScreen /> : <LoginScreen />} */}
          {isLoggedIn ? <HomeScreen /> : isGuestTracker ? <TrackOne /> : <LoginScreen />}
        </UserContext.Provider>
      </div>
    </Router>
  )
}

export default App
