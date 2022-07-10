import React from 'react'
import './VehicleDetailsBarBtns.css'
import symbol from '../uiAssets/share.svg'

function VehicleDetailsBarShareBtn() {
  return (
    <div className="actionBtn">
      <img src={symbol} alt="Share" />
    </div>
  )
}

export default VehicleDetailsBarShareBtn
