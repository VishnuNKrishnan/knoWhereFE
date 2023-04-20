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
import VisitedLocationsListSymbol from '../uiAssets/landmark.svg'
import isToday from '../customModules/isToday'
import VehicleDetailsBarLogoutBtn from './VehicleDetailsBarLogoutBtn'

function VehicleDetailsBar(props) {
  //Setting the context values...
  const {
    setIsLoggedIn,
    isGuestTracker,
    currentVehicleId,
    detailedInfoToggleStatus,
    setDetailedInfoToggleStatus,
    dataFromDate
  } = useContext(UserContext)

  const [onlineStatus, setOnlineStatus] = useState({
    class: 'connecting', //The CSS Class - Online or Offline
    text: 'waiting', //The text to be displayed in the UI - Online or Offline
  })

  const [licensePlate, setLicensePlate] = useState('Loading...')
  const [driverName, setDriverName] = useState('Fetching Driver...')
  const [driverContact, setDriverContact] = useState('Loading...')
  const [vehicleType, setVehicleType] = useState('Loading...')
  const [vehicleGroup, setVehicleGroup] = useState('Loading...')
  const [displayPictureBase64, setDisplayPictureBase64] = useState('')
  const setDriverDPArray = props.setDriverDPArray
  const [speed, setSpeed] = useState(0)
  const [secondsAfterLastContact, setSecondsAfterLastContact] = useState(0) // Used to display online/offline status
  const [isOnline, setIsOnline] = useState(false)
  const [
    vehicleDetailsBarOuterElementsStyle,
    setVehicleDetailsBarOuterElementsStyle,
  ] = useState({})
  const [whatsAppShareUrl, setWhatsAppShareUrl] = useState('')

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
        `${process.env.REACT_APP_API_SERVER_BASE_URL}/app/getVehicleDetails`,
        // `http://192.168.0.150:3001/app/getVehicleDetails`,
        options,
      ).catch((err) => console.log(err))
      const serverResponseData = await serverResponse.json()

      setLicensePlate(serverResponseData.licensePlate)
      setDriverName(serverResponseData.driverName)
      setDriverContact(serverResponseData.driverContact)
      setVehicleType(serverResponseData.vehicleType)
      setVehicleGroup(serverResponseData.vehicleGroup)
      setDisplayPictureBase64(serverResponseData.displayPictureBase64)
      setDriverDPArray([serverResponseData.displayPictureBase64])
      setWhatsAppShareUrl(serverResponseData.trackingIds ? `https://api.whatsapp.com/send?text=Track%20my%20journey%20at:%0A%0Ahttps://knowherefe.herokuapp.com/?trackingId=${serverResponseData.trackingIds[0].id.replace(' ', '')}%0A%0AUse password: ${serverResponseData.trackingIds[0].trackingPassword}` : ``)
      console.log(serverResponseData);
    }
    getVehicleDetailsAndUpdateUI()
  }, [])

  useEffect(() => {
    if (props.liveOnlineOffline == 'online') {
      setOnlineStatus({
        class: 'online', //The CSS Class - Online or Offline
        text: 'online', //The text to be displayed in the UI - Online or Offline
      })
    } else if (props.liveOnlineOffline == 'offline') {
      setOnlineStatus({
        class: 'offline', //The CSS Class - Online or Offline
        text: 'offline', //The text to be displayed in the UI - Online or Offline
      })
    } else if (props.liveOnlineOffline == 'connecting') {
      setOnlineStatus({
        class: 'connecting', //The CSS Class - Online or Offline
        text: 'waiting', //The text to be displayed in the UI - Online or Offline
      })
    }
  }, [props.liveOnlineOffline])

  return (
    <div className={`vehicleDetailsBar ${isToday(dataFromDate) && onlineStatus.text}`}>
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
            {isToday(dataFromDate) && <div className={`onlineStatus ${onlineStatus.class}`}>
              <p>{onlineStatus.text}</p>
            </div>}
          </div>
          <p>
            {driverName}
            <span className="driverContactNumber"> | {driverContact}</span>
          </p>
          <p>{textReduce(vehicleType.split(',')[0], 17)}</p>
          <p className=''>{textReduce(vehicleGroup, 25)}</p>
        </div>
      </div>

      {isToday(dataFromDate) &&
        <div className="avgSpeedHolder">
          {/* <p className="avgSpeed">{speed}</p> */}
          <p className="avgSpeed">{props.liveSpeed}</p>
          <p className="avgSpeedUnit">km/h</p>
        </div>
      }

      <div className="actionsHolder">
        <CallDriverBtn
          driverContactNumber={driverContact}
        />
        <VehicleDetailsBarInfoBtn />
        {!isGuestTracker && <VehicleDetailsBarShareBtn
          whatsAppShareUrl={whatsAppShareUrl}
        />}
        {!isGuestTracker ? <VehicleDetailsBarCloseBtn /> : <VehicleDetailsBarLogoutBtn />}
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

      {isToday(dataFromDate) &&
        <div
          className="outerAvgSpeedHolder"
          style={vehicleDetailsBarOuterElementsStyle}
        >
          {/* <p className="outerAvgSpeed">{speed}</p> */}
          <p className="outerAvgSpeed">{props.liveSpeed}</p>
          <p className="outerAvgSpeedUnit">km/h</p>
        </div>
      }
    </div>
  )
}

export default VehicleDetailsBar
