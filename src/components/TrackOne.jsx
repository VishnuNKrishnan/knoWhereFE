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
    dataFromDate,
    setDataFromDate,
    dataToDate,
    setDataToDate,
    currentVehicleId
  } = useContext(UserContext)

  if (!isLoggedIn) {
  }
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

  // Handle Live Tracking if isToday == true
  const [liveCoords, setLiveCoords] = useState([])
  const [liveSpeed, setLiveSpeed] = useState('...')
  const [liveLocations, setLiveLocations] = useState([])
  const [liveOnlineOffline, setLiveOnlineOffline] = useState(0)
  const [liveLastOnlineTimestamp, setLiveLastOnlineTimestamp] = useState(0)
  const [socket, setSocket] = useState(null)
  useEffect(() => {
    if (isToday(dataFromDate)) {// Create a new WebSocket connection when the component mounts
      const newSocket = new WebSocket('ws://nvmservices.ddns.net:4001')
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
          if (Math.floor(liveTrackingData.speed * 3.6) > 120) {
            setPopupUpdateType('overspeedingAlert')
          }
          var newCoords = []
          liveTrackingData.newCoords.map(obj => {
            newCoords.push([obj.currentLatitude, obj.currentLongitude])
          })
          setLiveCoords([...liveCoords, ...newCoords])
          setLiveOnlineOffline(liveTrackingData.onlineStatus)
          setLiveLastOnlineTimestamp(liveTrackingData.lastOnlineTimestamp)

          //Trigger location popup if location is updated:
          if (liveTrackingData.liveLocationIsUpdated) {
            const currentPositionBrief = getFormattedLocation(liveTrackingData.location).mainLocation
            const currentPositionFull = getFormattedLocation(liveTrackingData.location).subLocation
            setCurrentLocationBrief(currentPositionBrief)
            setCurrentLocationFull(currentPositionFull)
            setLiveLocations([...liveLocations, liveTrackingData.location])
            setPopupUpdateType('landmarkUpdate')
          }
        }
      }
    }
  }, [socket])

  const connectivityCheck = () => {
    const timeOutId = setInterval(() => {
      console.log(`CONNECTIVITY CHECK`)
      if (Date.now() - liveLastOnlineTimestamp > 30000) {
        setLiveOnlineOffline('offline')
        setLiveSpeed('...')
        console.log(`OFFLINE`)
      } else {
        setLiveOnlineOffline('online')
        console.log(`ONLINE`)
      }
    }, 30000)
  }
  useEffect(() => {
    connectivityCheck()
  }, [])

  return (
    <div className="TrackOneWrapper">
      <PopupMessageTop
        updateType={popupUpdateType} //Used to define what kind of update is being triggered. The popup will be formatted based on this value. Accepted values: landmarkUpdate | weatherOKUpdate | weatherBadUpdate | hasTravelledUpdate | hasNotTravelledUpdate | contactNumberUnavailable | activatingLiveModeUpdate | deactivatingLiveModeUpdate | overspeedingAlert
        setUpdateType={setPopupUpdateType}
        currentPositionBrief={currentLocationBrief}
        currentPositionFull={currentLocationFull}
        currentWhetherHeadline={'Pleasant Weather here'}
        currentWhetherFull={'Whether is good.'}
        currentHeadline={popupCurrentHeadline}
        currentText={popupCurrentText}
      />
      <MapHolder
        liveCoords={liveCoords} //only used if live tracking is active
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
