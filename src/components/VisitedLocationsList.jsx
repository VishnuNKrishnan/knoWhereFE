import React, { useState, useContext } from 'react'
import { UserContext } from '../userContext'
import { useEffect } from 'react'
import VisitedLocationsListItem from './VisitedLocationsListItem'
import VisitedLocationsListOptions from './VisitedLocationsListOptions'
import './VisitedLocationsList.css'
import db from '../firebase'
import { collection, onSnapshot, doc, getDoc } from 'firebase/firestore'
import LoadingBarSlim from './loaders/LoadingBarSlim'
import getFormattedLocation from '../customModules/getFormattedLocation'

function VisitedLocationsList(props) {
  //Setting the context values...
  const {
    currentVehicleId,
    dataFromDate,
    dataToDate,
    hasTravelledOnDate,
    setHasTravelledOnDate,
  } = useContext(UserContext)

  const [loading, setLoading] = useState(true)
  const [visitedLocationsList, setVisitedLocationsList] = useState([])

  useEffect(() => {
    async function fetchVisitedLocationsFromServerAnUpdateOnListHolder() {
      setLoading(true)
      setVisitedLocationsList([])

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
        `${process.env.REACT_APP_API_SERVER_BASE_URL}/app/getVisitedLocations`,
        //`http://192.168.0.150:3001/app/getVisitedLocations`,
        options,
      ).catch((err) => console.log(err))
      const serverResponseData = await serverResponse.json()
      setVisitedLocationsList(serverResponseData)
      setLoading(false)
    }
    fetchVisitedLocationsFromServerAnUpdateOnListHolder()
  }, [dataFromDate, dataToDate])

  var listHolderToggleClass
  props.visitedLocationsListToggleStatus
    ? (listHolderToggleClass = 'active')
    : (listHolderToggleClass = 'inactive')

  return (
    <div className={`listHolder ${listHolderToggleClass}`}>
      <VisitedLocationsListOptions />
      {loading ? (
        <LoadingBarSlim display={'block'} />
      ) : (
        <LoadingBarSlim display={'none'} />
      )}
      {visitedLocationsList.map((obj, index) => {
        var isLastBranch
        if (visitedLocationsList.length == index + 1) {
          isLastBranch = true
        } else {
          isLastBranch = false
        }
        {
          var timestampFromObject = new Date(obj.timestampOfVehiclePresence)
          var timestampHours = timestampFromObject.getHours()
          if (timestampHours < 10) {
            timestampHours = `0${timestampFromObject.getHours()}`
          }
          var timestampMinutes = timestampFromObject.getMinutes()
          if (timestampMinutes < 10) {
            timestampMinutes = `0${timestampFromObject.getMinutes()}`
          }
          var timestampOfVehiclePresence = `${timestampHours}:${timestampMinutes}`

          //Location Details Formatting Using Custom Function From Custom Modules Directory
          var formattedLocationDataObject = getFormattedLocation(obj)
        }

        return (
          <VisitedLocationsListItem
            key={index}
            divId={index}
            locationName={formattedLocationDataObject.mainLocation}
            subLocationName={formattedLocationDataObject.subLocation}
            time={timestampOfVehiclePresence}
            isLastBranch={isLastBranch}
            docId={obj.timestampOfVehiclePresence}
          />
        )
      })}
    </div>
  )
}

export default VisitedLocationsList
