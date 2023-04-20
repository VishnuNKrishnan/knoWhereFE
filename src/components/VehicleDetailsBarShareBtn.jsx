import React from 'react'
import './VehicleDetailsBarBtns.css'
import symbol from '../uiAssets/share.svg'

function VehicleDetailsBarShareBtn(props) {

  const whatsAppShareUrl = props.whatsAppShareUrl ? props.whatsAppShareUrl : ''

  return (
    <div className="actionBtn" onClick={() => { if (whatsAppShareUrl != '') { window.open(whatsAppShareUrl, '_blank') } }}>
      <img src={symbol} alt="Share" />
    </div>
  )
}

export default VehicleDetailsBarShareBtn
