import React, { useContext } from 'react'
import './VehicleDetailsBarBtns.css'
import symbol from '../uiAssets/home.svg'
import { UserContext } from '../userContext'

function VehicleDetailsBarCloseBtn() {
  const {
    setIsLoggedIn,
    homeScreenCurrentScreen,
    setHomeScreenCurrentScreen,
  } = useContext(UserContext)

  return (
    <div
      className="actionBtn"
      onClick={() => setHomeScreenCurrentScreen('appDashboard')}
    >
      <img src={symbol} alt="Close" />
    </div>
  )
}

export default VehicleDetailsBarCloseBtn
