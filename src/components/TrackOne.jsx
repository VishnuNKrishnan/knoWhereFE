// Component that displays the movement and details of a single vehicle in the fleet

import React, { useState, useContext, useEffect } from 'react'
import MapHolder from './MapHolder'
import VehicleDetailsBar from './VehicleDetailsBar'
import VisitedLocationsList from './VisitedLocationsList'
import './TrackOne.css'
import { UserContext } from '../userContext'
import dateStringToTimestamp from '../customModules/dateStringToTimestamp'
import getWeekDayLabel from '../customModules/getWeekDayLabel'
import JourneyInfoDetailed from './JourneyInfoDetailed'
import PopupMessageTop from './PopupMessageTop'
import isToday from '../customModules/isToday'
import getFormattedLocation from '../customModules/getFormattedLocation'

function TrackOne(props) {
  const {
    isLoggedIn,
    isGuestTracker,
    dataFromDate,
    setDataFromDate,
    dataToDate,
    setDataToDate,
    currentVehicleId
  } = useContext(UserContext)

  //Visited locations list is an individual component. However, its toggle button is part of the vehicle details bar component, due to ease of CSS styling. Hence, visitedLocationsListIsActive and its set function is declared here - in TrackOne.jsx, the container - and passed into both the components through props.
  const [
    visitedLocationsListToggleStatus,
    setVisitedLocationsListToggleStatus,
  ] = useState(false)

  const [driverDPArray, setDriverDPArray] = useState([]) //Array of driver DPs as base64 strings. This is fetched by the VehicleDetailsBar component, and upadted here using the setDriverDPArray function defined here.

  const [popupCount, setPopupCount] = useState(0)
  const [popupUpdateType, setPopupUpdateType] = useState('landmarkUpdate')
  const [currentLocationBrief, setCurrentLocationBrief] = useState('')
  const [currentLocationFull, setCurrentLocationFull] = useState('')
  const [popupCurrentHeadline, setPopupCurrentHeadline] = useState('')
  const [popupCurrentText, setPopupCurrentText] = useState('')

  //Current Weather Data - To display Popup if the value is changed
  const [currentWeatherObject, setCurrentWeatherObject] = useState({})

  const [lastOverspeedingDisplayTimestamp, setLastOverspeedingDisplayTimestamp] = useState(0) //Used to check if more than a minute has passed after the last overspeeding popup was dsplayed. if not, overspeeding popup trigger will be ignored.


  // Handle Live Tracking if isToday == true
  const [liveCoords, setLiveCoords] = useState([])
  const [liveHeading, setLiveHeading] = useState(0)
  const [liveSpeed, setLiveSpeed] = useState('...')
  const [liveLocations, setLiveLocations] = useState([])
  const [liveOnlineOffline, setLiveOnlineOffline] = useState('connecting')
  const [liveLastOnlineTimestamp, setLiveLastOnlineTimestamp] = useState(0)
  const [liveZoom, setLiveZoom] = useState(13)
  const [socket, setSocket] = useState(null)
  useEffect(() => {
    if (isToday(dataFromDate)) {// Create a new WebSocket connection when the component mounts
      // const newSocket = new WebSocket('ws://192.168.0.150:4002')
      const newSocket = new WebSocket('wss://vehicle-tracking-ws-server.herokuapp.com')
      setSocket(newSocket)
      console.log(newSocket)
      // Clean up the WebSocket connection when the component unmounts
      return () => {
        newSocket.close()
      }
    }
  }, [dataFromDate])

  const sendWebsocketRequest = () => {
    if (socket && socket.readyState === WebSocket.OPEN) {
      socket.send(JSON.stringify({ type: "liveTrackingDataRequest", vehicleId: currentVehicleId }))
    }
  }

  useEffect(() => {
    // Add an event listener to handle incoming messages from the WebSocket server
    if (socket) {
      socket.onopen = () => {
        sendWebsocketRequest()
      }
    }
  }, [socket])

  const [realTimeTrackingPopupActivated, setRealTimeTrackingPopupActivated] = useState(false)
  useEffect(() => {
    if (isToday(dataFromDate)) {
      setPopupUpdateType('activatingLiveModeUpdate')
      setRealTimeTrackingPopupActivated(true)
    } else {
      if (realTimeTrackingPopupActivated) {
        setPopupUpdateType('deactivatingLiveModeUpdate')
      }
      setRealTimeTrackingPopupActivated(false)
    }
  }, [dataFromDate])

  useEffect(() => {
    // Add an event listener to handle incoming messages from the WebSocket server
    if (socket) {
      socket.onmessage = event => {
        console.log(JSON.parse(event.data))
        const liveTrackingData = JSON.parse(event.data)

        if (liveTrackingData.type == "liveLocationUpdate") {
          setLiveSpeed(Math.floor(liveTrackingData.speed * 3.6))
          // if (liveTrackingData.overSpeeding == true) {
          //   const currentTimestamp = Date.now()
          //   if (currentTimestamp - lastOverspeedingDisplayTimestamp > 300000) { //Find out how long this is
          //     setPopupUpdateType('overspeedingAlert') //This triggers the popup
          //     setLastOverspeedingDisplayTimestamp(currentTimestamp)
          //   }
          // }

          if (liveTrackingData.onlineStatus == 'offline') {
            setLiveSpeed('...')
          }

          //Set map zoom level based on vehicle speed
          if (Math.floor(liveTrackingData.speed * 3.6) >= 0 && Math.floor(liveTrackingData.speed * 3.6) < 60) {
            setLiveZoom(16)
          } else if (Math.floor(liveTrackingData.speed * 3.6) >= 60 && Math.floor(liveTrackingData.speed * 3.6) < 90) {
            setLiveZoom(15)
          } else if (Math.floor(liveTrackingData.speed * 3.6) >= 90 && Math.floor(liveTrackingData.speed * 3.6) < 110) {
            setLiveZoom(14)
          } else if (Math.floor(liveTrackingData.speed * 3.6) >= 110 && Math.floor(liveTrackingData.speed * 3.6) < 130) {
            setLiveZoom(13)
          } else if (Math.floor(liveTrackingData.speed * 3.6) > 130) {
            setLiveZoom(12)
          }

          setLiveCoords([[liveTrackingData.latitude, liveTrackingData.longitude]])
          setLiveOnlineOffline(liveTrackingData.onlineStatus)
          setLiveLastOnlineTimestamp(liveTrackingData.lastOnlineTimestamp)
          setLiveHeading(liveTrackingData.heading)
        }

        if (liveTrackingData.type == "locationUpdate") {
          const currentPositionBrief = getFormattedLocation(liveTrackingData.location).mainLocation
          const currentPositionFull = getFormattedLocation(liveTrackingData.location).subLocation
          setCurrentLocationBrief(currentPositionBrief)
          setCurrentLocationFull(currentPositionFull)

          if (liveLocations.length == 0) {
            setLiveLocations([liveTrackingData.location])
          } else {
            if ((liveLocations[liveLocations.length - 1]).timestampOfVehiclePresence != liveTrackingData.location.timestampOfVehiclePresence) {
              setLiveLocations([liveTrackingData.location])
            }
          }
          setPopupUpdateType('landmarkUpdate')
        }

        if (liveTrackingData.type == "weatherUpdate") {
          setTimeout(() => {
            setCurrentWeatherObject(liveTrackingData.weather)
            setPopupUpdateType('weatherOKUpdate')
          }, 10000)
        }
      }
    }
  }, [socket])

  return (
    <div className="TrackOneWrapper">
      <PopupMessageTop
        updateType={popupUpdateType} //Used to define what kind of update is being triggered. The popup will be formatted based on this value. Accepted values: landmarkUpdate | weatherOKUpdate | weatherBadUpdate | hasTravelledUpdate | hasNotTravelledUpdate | contactNumberUnavailable | activatingLiveModeUpdate | deactivatingLiveModeUpdate | overspeedingAlert
        setUpdateType={setPopupUpdateType}
        currentPositionBrief={currentLocationBrief}
        currentPositionFull={currentLocationFull}
        currentWeatherObject={currentWeatherObject}
        currentHeadline={popupCurrentHeadline}
        currentText={popupCurrentText}
      />
      <MapHolder
        liveCoords={liveCoords} //only used if live tracking is active
        liveHeading={liveHeading} //only used if live tracking is active
        liveZoom={liveZoom}
      />

      <VisitedLocationsList
        visitedLocationsListToggleStatus={visitedLocationsListToggleStatus}
        setVisitedLocationsListToggleStatus={
          setVisitedLocationsListToggleStatus
        }
        liveLocations={liveLocations}
      />
      <VehicleDetailsBar
        visitedLocationsListToggleStatus={visitedLocationsListToggleStatus}
        setVisitedLocationsListToggleStatus={
          setVisitedLocationsListToggleStatus
        }
        setDriverDPArray={setDriverDPArray}
        liveSpeed={liveSpeed}
        liveOnlineOffline={liveOnlineOffline}
      />

      <JourneyInfoDetailed
        driverDPArray={driverDPArray}
      />
    </div>
  )
}

export default TrackOne
