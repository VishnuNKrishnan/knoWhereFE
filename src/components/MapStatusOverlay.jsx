import React from 'react'
import CircularLoader from './loaders/CircularLoader'
import './MapStatusOverlay.css'
import ParkedCarLogo from '../uiAssets/parkedCar.svg'

function MapStatusOverlay(props) {
  return (
    <div className="overlayHolder">
      <div className="statusHolder">
        {props.loading ? <CircularLoader /> : <p>{props.messageToDisplay}</p>}
      </div>
    </div>
  )
}

export default MapStatusOverlay
