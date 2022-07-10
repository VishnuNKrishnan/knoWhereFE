import React from 'react'
import './ChooseVehicleToTrack.css'

function ChooseVehicleToTrack() {
  return (
    <div className="individualTrackingSection">
      <h1 className="sectionTitle">Choose a vehicle to track...</h1>
      <div className="vehicleDetailsRow">
        <div className="numberPlate">
          <span>DXB F 85658</span>
        </div>
        <div
          className="vehicleBrandLogo"
          style={{
            backgroundImage: `url("https://www.carlogos.org/car-logos/volvo-logo.png")`,
          }}
        ></div>
        <div className="vehicleDescription">
          <p>Volvo BR60 - Bus</p>
          <p>Johnny Antony</p>
        </div>
      </div>

      <div className="vehicleDetailsRow">
        <div className="numberPlate">
          <span>DXB N 45286</span>
        </div>
        <div
          className="vehicleBrandLogo"
          style={{
            backgroundImage: `url("https://www.carlogos.org/car-logos/ford-logo.png")`,
          }}
        ></div>
        <div className="vehicleDescription">
          <p>Volvo BR60 - Bus</p>
          <p>Rowan Atkinson</p>
        </div>
      </div>

      <div className="vehicleDetailsRow">
        <div className="numberPlate">
          <span>SHJ 52478</span>
        </div>
        <div
          className="vehicleBrandLogo"
          style={{
            backgroundImage: `url("https://www.carlogos.org/car-logos/volvo-logo.png")`,
          }}
        ></div>
        <div className="vehicleDescription">
          <p>Volvo BR60 - Bus</p>
          <p>Siddique Lal</p>
        </div>
      </div>
    </div>
  )
}

export default ChooseVehicleToTrack
