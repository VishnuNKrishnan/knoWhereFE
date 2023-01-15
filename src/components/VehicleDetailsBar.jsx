import React, { useState, useEffect, useContext } from 'react'
import { UserContext } from '../userContext'
import textReduce from '../customModules/textReduce'
import CallDriverQRCode from './popups/CallDriverQRCode'
import './VehicleDetailsBar.css'
import db from '../firebase'
import { doc, onSnapshot } from 'firebase/firestore'
import CallDriverBtn from './CallDriverBtn'
import VehicleDetailsBarInfoBtn from './VehicleDetailsBarInfoBtn'
import VehicleDetailsBarShareBtn from './VehicleDetailsBarShareBtn'
import VehicleDetailsBarCloseBtn from './VehicleDetailsBarCloseBtn'
import VisitedLocationsListSymbol from '../uiAssets/list.svg'
import { Link } from 'react-router-dom'

function VehicleDetailsBar(props) {
  //Setting the context values...
  const {
    setIsLoggedIn,
    currentVehicleId,
    detailedInfoToggleStatus,
    setDetailedInfoToggleStatus,
  } = useContext(UserContext)

  const [onlineStatus, setOnlineStatus] = useState({
    class: 'offline', //The CSS Class - Online or Offline
    text: 'offline', //The text to be displayed in the UI - Online or Offline
  })

  const [licensePlate, setLicensePlate] = useState('Loading...')
  const [driverName, setDriverName] = useState('Fetching Driver...')
  const [driverContact, setDriverContact] = useState('Loading...')
  const [vehicleType, setVehicleType] = useState('Loading...')
  const [vehicleGroup, setVehicleGroup] = useState('Loading...')
  const [displayPictureBase64, setDisplayPictureBase64] = useState('')
  const [speed, setSpeed] = useState(0)
  const [secondsAfterLastContact, setSecondsAfterLastContact] = useState(0) // Used to display online/offline status
  const [isOnline, setIsOnline] = useState(false)
  const [
    vehicleDetailsBarOuterElementsStyle,
    setVehicleDetailsBarOuterElementsStyle,
  ] = useState({})

  useEffect(() => {
    detailedInfoToggleStatus
      ? setVehicleDetailsBarOuterElementsStyle({ right: '-85px' })
      : setVehicleDetailsBarOuterElementsStyle({})
  }, [detailedInfoToggleStatus])

  useEffect(() => {
    async function getVehicleDetailsAndUpdateUI() {
      const data = {
        vehicleId: currentVehicleId,
      }
      const options = {
        method: 'POST',
        body: JSON.stringify(data),
        mode: 'cors',
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json',
        },
      }

      const serverResponse = await fetch(
        // `${process.env.REACT_APP_API_SERVER_BASE_URL}/app/getVehicleDetails`,
        `http://192.168.0.150:3001/app/getVehicleDetails`,
        options,
      ).catch((err) => console.log(err))
      const serverResponseData = await serverResponse.json()

      setLicensePlate(serverResponseData.licensePlate)
      setDriverName(serverResponseData.driverName)
      setDriverContact(serverResponseData.driverContact)
      setVehicleType(serverResponseData.vehicleType)
      setVehicleGroup(serverResponseData.vehicleGroup)
      setDisplayPictureBase64(serverResponseData.displayPictureBase64)

      //CODE TO MAKE ONLINE/OFFLINE STATUS WORK
      const currentTimestamp = Date.now()
      if (serverResponseData.lastOnline && currentTimestamp - serverResponseData.lastOnline < 60000) {
        setOnlineStatus({
          class: 'online', //The CSS Class - Online or Offline
          text: 'online', //The text to be displayed in the UI - Online or Offline
        })
      } else {
        setOnlineStatus({
          class: 'offline', //The CSS Class - Online or Offline
          text: 'offline', //The text to be displayed in the UI - Online or Offline
        })
      }
    }
    getVehicleDetailsAndUpdateUI()
  }, [])

  return (
    <div className="vehicleDetailsBar">
      <div className="vehicleDetailsHolder">
        <div
          className="dpHolder"
          style={{
            backgroundImage: `url(${displayPictureBase64})`,
          }}
        ></div>
        <div>
          <div className="vehicleNumAndStatus">
            <h1>{licensePlate}</h1>
            <div className={`onlineStatus ${onlineStatus.class}`}>
              <p>{onlineStatus.text}</p>
            </div>
          </div>
          <p>
            {driverName}
            <span className="driverContactNumber"> | {driverContact}</span>
          </p>
          <p>{textReduce(vehicleType, 25)}</p>
          <p>{textReduce(vehicleGroup, 25)}</p>
        </div>
      </div>

      <div className="avgSpeedHolder">
        <p className="avgSpeed">{speed}</p>
        <p className="avgSpeedUnit">km/h</p>
      </div>

      <div className="actionsHolder">
        <CallDriverBtn
          driverContactNumber={driverContact}
        />
        <VehicleDetailsBarInfoBtn />
        <VehicleDetailsBarShareBtn />
        <VehicleDetailsBarCloseBtn />
        <div
          className="visitedLocationsListToggleBtn"
          style={vehicleDetailsBarOuterElementsStyle}
          onClick={() => {
            props.setVisitedLocationsListToggleStatus(
              !props.visitedLocationsListToggleStatus,
            )
          }}
        >
          <img
            src={VisitedLocationsListSymbol}
            alt="Show/Hide visited locations"
          />
        </div>
      </div>
      <div
        className="outerAvgSpeedHolder"
        style={vehicleDetailsBarOuterElementsStyle}
      >
        <p className="outerAvgSpeed">{speed}</p>
        <p className="outerAvgSpeedUnit">km/h</p>
      </div>
    </div>
  )
}

export default VehicleDetailsBar
