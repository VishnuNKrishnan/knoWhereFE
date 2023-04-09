import React, { useContext, useState, useEffect, useRef } from 'react'
import './Dashboard_SelectedVehicleOptions.css'
import { UserContext } from '../userContext'
import CircularLoader from './loaders/CircularLoader'
import BlockLoader from './loaders/BlockLoader'
import ToggleSwitch from './switches/ToggleSwitch'
import VerifiedSymbol from '../uiAssets/verified.png'

function Dashboard_SelectedVehicleOptions() {
  const {
    loggedInAccountId,
    setLoggedInAccountId,
    currentVehicleId,
    dashboardCurrentScreen,
    setHomeScreenCurrentScreen,
    setDashboardCurrentScreen,
    dataFromDate,
    dataToDate,
    hasTravelledOnDate,
    setHasTravelledOnDate,
  } = useContext(UserContext)

  const [isLoading, setIsLoading] = useState(true)
  const [vehicleDetailsObject, setVehicleDetailsObject] = useState(false)
  const [manageDriverBtnLabel, setManageDriverBtnLabel] = useState(
    'Please wait...',
  )
  const templateDP =
    'data:image/jpg;base64,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'

  async function collectVehicleDetailsAndUpdateOnUI() {
    const data = {
      vehicleId: currentVehicleId,
    }
    const options = {
      method: 'POST',
      body: JSON.stringify(data),
      mode: 'cors',
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json',
      },
    }

    const serverResponse = await fetch(
      `${process.env.REACT_APP_API_SERVER_BASE_URL}/app/getVehicleDetails`,
      // `http://192.168.0.150:3001/app/getVehicleDetails`,
      options,
    ).catch((err) => console.log(err))
    const serverResponseData = await serverResponse.json()
    console.log(serverResponseData)

    setVehicleDetailsObject(serverResponseData)
    serverResponseData.driverName === 'Driver Unassigned'
      ? setManageDriverBtnLabel('Assign Driver')
      : setManageDriverBtnLabel('Remove Driver')
    setIsLoading(false)
  }

  //Run on first load of component
  useEffect(() => {
    collectVehicleDetailsAndUpdateOnUI()
    document.getElementsByClassName('mainContentHolder')[0].scrollTop = 0
  }, [])

  async function removeDriverFromVehicleIDandUpdateOnUI() {
    setIsLoading(true)
    const data = { vehicleId: currentVehicleId }
    const options = {
      method: 'POST',
      body: JSON.stringify(data),
      mode: 'cors',
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json',
      },
    }
    const serverResponse = await fetch(
      `${process.env.REACT_APP_API_SERVER_BASE_URL}/app/removeDriverFromVehicle`,
      // `http://192.168.0.150:3001/app/removeDriverFromVehicle`,
      // `http://nvmservices.ddns.net:3001/app/removeDriverFromVehicle`,
      options,
    ).catch((err) => console.log(err))
    const serverResponseData = await serverResponse.json()
    console.log(serverResponseData)

    collectVehicleDetailsAndUpdateOnUI()
  }

  return (
    <div className="dashboard_selectedVehicleOptionsWrapper">
      <div className="sectionHeading">
        <h2>
          {vehicleDetailsObject.licensePlate
            ? vehicleDetailsObject.licensePlate
            : 'Loading...'}
        </h2>
      </div>
      <div className="contentContainer">
        <div className="row1Container">
          <div
            className="dpContainer"
            style={{
              backgroundImage: `url(${vehicleDetailsObject.displayPictureBase64
                ? vehicleDetailsObject.displayPictureBase64
                : templateDP
                })`,
            }}
          >
            {isLoading ? <CircularLoader /> : null}
          </div>
          <div className="detailsHolder_wideScreen">
            <div>
              <p>Current Driver</p>
              <h3>
                {vehicleDetailsObject.driverName ? (
                  vehicleDetailsObject.driverName
                ) : (
                  <BlockLoader />
                )}
              </h3>
            </div>
            <div>
              <p>Contact Number</p>
              <h3>
                {vehicleDetailsObject.driverContact ? (
                  vehicleDetailsObject.driverContact
                ) : (
                  <BlockLoader />
                )}
                {vehicleDetailsObject.driverContactVerified === true ? <img className="verifiedSymbol" src={VerifiedSymbol} alt="" /> : null}
              </h3>
            </div>
            <div>
              <p>Contact Email ID</p>
              <h3>
                {vehicleDetailsObject.driverEmail ? (
                  vehicleDetailsObject.driverEmail
                ) : (
                  <BlockLoader />
                )}
              </h3>
            </div>
          </div>
          <div className="CTAsHolder">
            <div
              className="btn primaryCTA"
              onClick={() => {
                setHomeScreenCurrentScreen('trackOne')
              }}
            >
              <p>TRACK</p>
            </div>
            {isLoading ? (
              <BlockLoader />
            ) : (
              <div
                className="btn secondaryCTA"
                onClick={() => {
                  manageDriverBtnLabel === 'Assign Driver'
                    ? setDashboardCurrentScreen('assignDriver')
                    : removeDriverFromVehicleIDandUpdateOnUI()
                }}
              >
                <p>{manageDriverBtnLabel}</p>
              </div>
            )}

            {isLoading ? (
              <BlockLoader />
            ) : (
              <div className="btn secondaryCTA">
                <p>Edit Vehicle Details</p>
              </div>
            )}
          </div>
        </div>
        <div className="row2Container">
          <div className="detailsHolder_mobile">
            <div>
              <p>Current Driver</p>
              <h3>
                {vehicleDetailsObject.driverName ? (
                  vehicleDetailsObject.driverName
                ) : (
                  <BlockLoader />
                )}
              </h3>
            </div>
            <div>
              <p>Contact Number</p>
              <h3>
                {vehicleDetailsObject.driverContact ? (
                  vehicleDetailsObject.driverContact
                ) : (
                  <BlockLoader />
                )}
                {vehicleDetailsObject.driverContactVerified === true ? <img className="verifiedSymbol" src={VerifiedSymbol} alt="" /> : null}
              </h3>
            </div>
            <div>
              <p>Contact Email ID</p>
              <h3>
                {vehicleDetailsObject.driverEmail ? (
                  vehicleDetailsObject.driverEmail
                ) : (
                  <BlockLoader />
                )}
              </h3>
            </div>
          </div>
        </div>
        <div className="sectionSeparatorHolder">
          <div className="separatorLine"></div>
          <div className="sectionName">
            <p>VEHICLE DETAILS</p>
          </div>
          <div className="separatorLine"></div>
        </div>
        <div className="row3Container">
          <div className="vehicleDetailsItemCard">
            <p>Vehicle ID</p>
            <h3>
              {vehicleDetailsObject.licensePlate ? (
                currentVehicleId
              ) : (
                <BlockLoader />
              )}
            </h3>
          </div>

          <div className="vehicleDetailsItemCard">
            <p>License Plate</p>
            <h3>
              {vehicleDetailsObject.licensePlate ? (
                vehicleDetailsObject.licensePlate
              ) : (
                <BlockLoader />
              )}
            </h3>
          </div>

          <div className="vehicleDetailsItemCard">
            <p>Vehicle Type</p>
            <h3>
              {vehicleDetailsObject.vehicleType ? (
                vehicleDetailsObject.vehicleType
              ) : (
                <BlockLoader />
              )}
            </h3>
          </div>

          <div className="vehicleDetailsItemCard">
            <p>Group</p>
            <h3>
              {vehicleDetailsObject.vehicleGroup ? (
                vehicleDetailsObject.vehicleGroup
              ) : (
                <BlockLoader />
              )}
            </h3>
          </div>

          <div className="vehicleDetailsItemCard">
            <p>Engine Number</p>
            <h3>
              {vehicleDetailsObject.engineNumber ? (
                vehicleDetailsObject.engineNumber
              ) : (
                <BlockLoader />
              )}
            </h3>
          </div>

          <div className="vehicleDetailsItemCard">
            <p>Chassis Number</p>
            <h3>
              {vehicleDetailsObject.chassisNumber ? (
                vehicleDetailsObject.chassisNumber
              ) : (
                <BlockLoader />
              )}
            </h3>
          </div>
        </div>
        <div className="sectionSeparatorHolder">
          <div className="separatorLine"></div>
          <div className="sectionName">
            <p>ALERTS &amp; NOTIFICATIONS</p>
          </div>
          <div className="separatorLine"></div>
        </div>
        <div className="row3Container">
          <div className="vehicleDetailsItemCard">
            <p>Speed Limit</p>
            <h3>
              {vehicleDetailsObject.speedLimit ? (
                vehicleDetailsObject.speedLimit
              ) : (
                <BlockLoader />
              )}
            </h3>
          </div>

          <div className="vehicleDetailsItemCard">
            <p>SMS Alert</p>
            <ToggleSwitch isToggled={true} />
            {/* <h3>ON</h3> */}
          </div>

          <div className="vehicleDetailsItemCard">
            <p>Email Alert</p>
            <ToggleSwitch isToggled={false} />
          </div>

          <div className="vehicleDetailsItemCard">
            <p>Receive Email Report</p>
            <ToggleSwitch isToggled={false} />
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard_SelectedVehicleOptions
