// Component that displays the movement and details of a single vehicle in the fleet

import React, { useState, useContext } from 'react'
import MapHolder from './MapHolder'
import VehicleDetailsBar from './VehicleDetailsBar'
import VisitedLocationsList from './VisitedLocationsList'
import './TrackOne.css'
import { UserContext } from '../userContext'
import dateStringToTimestamp from '../customModules/dateStringToTimestamp'
import getWeekDayLabel from '../customModules/getWeekDayLabel'
import JourneyInfoDetailed from './JourneyInfoDetailed'

function TrackOne(props) {
  const {
    isLoggedIn,
    dataFromDate,
    setDataFromDate,
    dataToDate,
    setDataToDate,
  } = useContext(UserContext)

  if (!isLoggedIn) {
  }
  //Visited locations list is an individual component. However, its toggle button is part of the vehicle details bar component, due to ease of CSS styling. Hence, visitedLocationsListIsActive and its set function is declared here - in TrackOne.jsx, the container - and passed into both the components through props.
  const [
    visitedLocationsListToggleStatus,
    setVisitedLocationsListToggleStatus,
  ] = useState(false)

  return (
    <div className="TrackOneWrapper">
      <MapHolder />

      <VisitedLocationsList
        visitedLocationsListToggleStatus={visitedLocationsListToggleStatus}
        setVisitedLocationsListToggleStatus={
          setVisitedLocationsListToggleStatus
        }
      />
      <VehicleDetailsBar
        visitedLocationsListToggleStatus={visitedLocationsListToggleStatus}
        setVisitedLocationsListToggleStatus={
          setVisitedLocationsListToggleStatus
        }
      />

      <JourneyInfoDetailed />
    </div>
  )
}

export default TrackOne
