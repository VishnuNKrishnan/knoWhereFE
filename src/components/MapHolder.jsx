import React, { useState, useEffect, useContext } from 'react'
import { UserContext } from '../userContext'
import BingMapsReact from 'bingmaps-react'
import { ReactBingmaps } from 'react-bingmaps'
import './MapHolder.css'
import db from '../firebase'
import { collection, query, onSnapshot, where } from 'firebase/firestore'
import MapStatusOverlay from './MapStatusOverlay'

function MapHolder() {
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
            option: { color: 'green' },
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
