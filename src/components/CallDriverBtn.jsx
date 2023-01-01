import React from 'react'
import './VehicleDetailsBarBtns.css'
import symbol from '../uiAssets/phone.svg'

function CallDriverBtn(props) {
  const driverContactNumber = props.driverContactNumber
  return (
    <div className="actionBtn">
      <a href={`tel:${driverContactNumber}`}>
        <img src={symbol} alt="Call Driver" />
      </a>
    </div>
  )
}

export default CallDriverBtn
