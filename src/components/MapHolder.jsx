import React, { useState, useEffect, useContext } from 'react'
import { UserContext } from '../userContext'
import BingMapsReact from 'bingmaps-react'
import { ReactBingmaps } from 'react-bingmaps'
import './MapHolder.css'
import db from '../firebase'
import { collection, query, onSnapshot, where } from 'firebase/firestore'
import MapStatusOverlay from './MapStatusOverlay'
import isToday from '../customModules/isToday'

//Vehicle Images
import vehicleTop0 from '../uiAssets/vehicleTop/vehicleTop0.png'
import vehicleTop15 from '../uiAssets/vehicleTop/vehicleTop15.png'
import vehicleTop30 from '../uiAssets/vehicleTop/vehicleTop30.png'
import vehicleTop45 from '../uiAssets/vehicleTop/vehicleTop45.png'
import vehicleTop60 from '../uiAssets/vehicleTop/vehicleTop60.png'
import vehicleTop75 from '../uiAssets/vehicleTop/vehicleTop75.png'
import vehicleTop90 from '../uiAssets/vehicleTop/vehicleTop90.png'
import vehicleTop105 from '../uiAssets/vehicleTop/vehicleTop105.png'
import vehicleTop120 from '../uiAssets/vehicleTop/vehicleTop120.png'
import vehicleTop135 from '../uiAssets/vehicleTop/vehicleTop135.png'
import vehicleTop150 from '../uiAssets/vehicleTop/vehicleTop150.png'
import vehicleTop165 from '../uiAssets/vehicleTop/vehicleTop165.png'
import vehicleTop180 from '../uiAssets/vehicleTop/vehicleTop180.png'
import vehicleTop195 from '../uiAssets/vehicleTop/vehicleTop195.png'
import vehicleTop210 from '../uiAssets/vehicleTop/vehicleTop210.png'
import vehicleTop225 from '../uiAssets/vehicleTop/vehicleTop225.png'
import vehicleTop240 from '../uiAssets/vehicleTop/vehicleTop240.png'
import vehicleTop255 from '../uiAssets/vehicleTop/vehicleTop255.png'
import vehicleTop270 from '../uiAssets/vehicleTop/vehicleTop270.png'
import vehicleTop285 from '../uiAssets/vehicleTop/vehicleTop285.png'
import vehicleTop300 from '../uiAssets/vehicleTop/vehicleTop300.png'
import vehicleTop315 from '../uiAssets/vehicleTop/vehicleTop315.png'
import vehicleTop330 from '../uiAssets/vehicleTop/vehicleTop330.png'
import vehicleTop345 from '../uiAssets/vehicleTop/vehicleTop345.png'

function MapHolder(props) {
  //Setting the context values...
  const {
    isLoggedIn,
    dataFromDate,
    dataToDate,
    currentVehicleId,
    hasTravelledOnDate,
    setHasTravelledOnDate,
  } = useContext(UserContext)

  const [polylineCoordsArray, setPolylineCoordsArray] = useState([])
  const [mapCenter, setMapCenter] = useState([])
  const [mapTypeId, setMapTypeId] = useState('road')
  const [mapIsLoading, setMapIsLoading] = useState(true) //Used to display Circular Loader on map if map is loading
  //Pushpin Image
  const [pushPinImage, setPushPinImage] = useState(vehicleTop0)

  useEffect(() => {
    async function fetchWaypointsCoordsFromServerAndUpdateOnMap() {
      setMapIsLoading(true)
      setPolylineCoordsArray([])
      //setMapTypeId('canvasLight')

      let coordsArray = []

      const data = {
        vehicleId: currentVehicleId,
        journeyStartDate: dataFromDate,
        journeyEndDate: dataToDate,
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
        `${process.env.REACT_APP_API_SERVER_BASE_URL}/app/getWayPoints`,
        //`http://192.168.0.150:3001/app/getWayPoints`,
        options,
      ).catch((err) => console.log(err))
      const serverResponseData = await serverResponse.json()

      coordsArray = serverResponseData

      if (coordsArray.length > 0) {
        setPolylineCoordsArray(coordsArray)
        setMapCenter(coordsArray[coordsArray.length - 1])
        setHasTravelledOnDate(true)
        setMapTypeId('road')
      } else {
        setHasTravelledOnDate(false)
      }
      //console.log(coordsArray)
      setMapIsLoading(false)
    }
    fetchWaypointsCoordsFromServerAndUpdateOnMap()
  }, [dataFromDate, dataToDate]) //re render if dataFromDate or dataToDate changes
  //console.log(polylineCoordsArray)

  //Update journey path when on live mode
  useEffect(() => {
    if (props.liveCoords.length > 0) {
      // console.log(polylineCoordsArray)
      // console.log(props.liveCoords)
      // var allCoordsArray = polylineCoordsArray
      // allCoordsArray.push(props.liveCoords)

      // console.log([...polylineCoordsArray, ...props.liveCoords]);

      setPolylineCoordsArray([...polylineCoordsArray, ...props.liveCoords])
      setMapCenter(props.liveCoords[props.liveCoords.length - 1])
    }
  }, [props.liveCoords])

  useEffect(() => { //Rotate pushpin based on liveheading
    console.log(props.liveHeading);
    const heading = props.liveHeading ? props.liveHeading : 0
    if (heading >= 352.5 && heading < 360 || heading >= 0 && heading < 7.5) { //0 - 14
      setPushPinImage(vehicleTop0)
    } else if (heading >= 7.5 && heading < 22.5) { //15 - 29
      setPushPinImage(vehicleTop15)
    } else if (heading >= 22.5 && heading < 37.5) {
      setPushPinImage(vehicleTop30)
    } else if (heading >= 37.5 && heading < 52.5) { //15 - 29
      setPushPinImage(vehicleTop45)
    } else if (heading >= 52.5 && heading < 67.5) { //15 - 29
      setPushPinImage(vehicleTop60)
    } else if (heading >= 67.5 && heading < 82.5) { //15 - 29
      setPushPinImage(vehicleTop75)
    } else if (heading >= 82.5 && heading < 97.5) { //15 - 29
      setPushPinImage(vehicleTop90)
    } else if (heading >= 97.5 && heading < 112.5) { //15 - 29
      setPushPinImage(vehicleTop105)
    } else if (heading >= 112.5 && heading < 127.5) { //15 - 29
      setPushPinImage(vehicleTop120)
    } else if (heading >= 127.5 && heading < 142.5) { //15 - 29
      setPushPinImage(vehicleTop135)
    } else if (heading >= 142.5 && heading < 157.5) { //15 - 29
      setPushPinImage(vehicleTop150)
    } else if (heading >= 157.5 && heading < 172.5) { //15 - 29
      setPushPinImage(vehicleTop165)
    } else if (heading >= 172.5 && heading < 187.5) { //15 - 29
      setPushPinImage(vehicleTop180)
    } else if (heading >= 187.5 && heading < 202.5) { //15 - 29
      setPushPinImage(vehicleTop195)
    } else if (heading >= 202.5 && heading < 217.5) { //15 - 29
      setPushPinImage(vehicleTop210)
    } else if (heading >= 217.5 && heading < 232.5) { //15 - 29
      setPushPinImage(vehicleTop225)
    } else if (heading >= 232.5 && heading < 247.5) { //15 - 29
      setPushPinImage(vehicleTop240)
    } else if (heading >= 247.5 && heading < 262.5) { //15 - 29
      setPushPinImage(vehicleTop255)
    } else if (heading >= 262.5 && heading < 277.5) { //15 - 29
      setPushPinImage(vehicleTop270)
    } else if (heading >= 277.5 && heading < 292.5) { //15 - 29
      setPushPinImage(vehicleTop285)
    } else if (heading >= 292.5 && heading < 307.5) { //15 - 29
      setPushPinImage(vehicleTop300)
    } else if (heading >= 307.5 && heading < 322.5) { //15 - 29
      setPushPinImage(vehicleTop315)
    } else if (heading >= 322.5 && heading < 337.5) { //15 - 29
      setPushPinImage(vehicleTop330)
    } else if (heading >= 337.5 && heading < 352.5) { //15 - 29
      setPushPinImage(vehicleTop345)
    }
  }, [props.liveHeading])

  return (
    <div className="mapHolder">
      <ReactBingmaps
        bingmapKey={process.env.REACT_APP_BING_MAPS_API_KEY}
        navigationBarMode={'compact'}
        mapTypeId={mapTypeId}
        center={mapCenter}
        const
        pushPins={[
          {
            location: mapCenter,
            option: { color: 'green', icon: pushPinImage, anchor: [32, 32] },
          },
        ]}
        polyline={{
          location: polylineCoordsArray,
          option: {
            strokeColor: 'green',
            strokeThickness: 3,
            strokeDashArray: [3, 1.5],
          },
        }}
      ></ReactBingmaps>
      {/* {console.log([...polylineCoordsArray, ...props.liveCoords])} */}
      {hasTravelledOnDate ? (
        mapIsLoading ? (
          <MapStatusOverlay loading={true}></MapStatusOverlay>
        ) : null
      ) : (
        <MapStatusOverlay notTravelled messageToDisplay={'Not Travelled'} />
      )}
    </div>
  )
}

export default MapHolder
