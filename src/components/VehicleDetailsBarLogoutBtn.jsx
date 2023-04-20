import React, { useContext } from 'react'
import './VehicleDetailsBarBtns.css'
import symbol from '../uiAssets/logout.svg'
import { UserContext } from '../userContext'

function VehicleDetailsBarLogoutBtn() {

  const {
    setIsLoggedIn,
    isGuestTracker,
    setIsGuestTracker,
    homeScreenCurrentScreen,
    setHomeScreenCurrentScreen,
  } = useContext(UserContext)

  return (
    <div
      className="actionBtn"
      onClick={() => {
        setIsGuestTracker(false)
        setHomeScreenCurrentScreen('loginScreen')
      }}
    >
      <img src={symbol} alt="Close" />
    </div>
  )
}

export default VehicleDetailsBarLogoutBtn
