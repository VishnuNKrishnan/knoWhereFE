import React from 'react'
import './VehicleDetailsBarBtns.css'
import symbol from '../uiAssets/phone.svg'

function CallDriverBtn() {
  return (
    <div className="actionBtn">
      <a href="tel:+971506738672">
        <img src={symbol} alt="Call Driver" />
      </a>
    </div>
  )
}

export default CallDriverBtn
