import React, { useContext } from 'react'
import { UserContext } from '../userContext'
import './VehicleDetailsBarBtns.css'
import symbol from '../uiAssets/info.svg'

function VehicleDetailsBarInfoBtn() {
  //Setting the context values...
  const { detailedInfoToggleStatus, setDetailedInfoToggleStatus } = useContext(
    UserContext,
  )
  return (
    <div className="actionBtn">
      <img
        src={symbol}
        alt="More Info"
        onClick={() => {
          setDetailedInfoToggleStatus(!detailedInfoToggleStatus)
        }}
      />
    </div>
  )
}

export default VehicleDetailsBarInfoBtn
