import React, { useEffect, useState, useContext } from 'react'
import { UserContext } from '../userContext'
import useDeepCompareEffect from 'use-deep-compare-effect'
import './Dashboard_TrackOneContentComponent.css'
import TrackOneLogo from '../uiAssets/aim.svg'
import AddLogo from '../uiAssets/plus.svg'
import CircularLoader from './loaders/CircularLoader'
import textReduce from '../customModules/textReduce'

function Dashboard_TrackOneContentComponent() {
  //Setting the context values...
  const {
    loggedInAccountId,
    setLoggedInAccountId,
    currentVehicleId,
    setCurrentVehicleId,
    homeScreenCurrentScreen,
    setHomeScreenCurrentScreen,
    dashboardCurrentScreen,
    setDashboardCurrentScreen,
    dataFromDate,
    dataToDate,
    hasTravelledOnDate,
    setHasTravelledOnDate,
  } = useContext(UserContext)

  const [isLoading, setIsLoading] = useState(true)
  const [allVehiclesListObject, setAllVehiclesListObject] = useState([])
  const [searchQueryInput, setSearchQueryInput] = useState('')
  const [searchedVehiclesListObject, setSearchedVehiclesListObject] = useState(
    [],
  )

  useDeepCompareEffect(() => {
    //UseDeepCompareEffect is the same as UseEffect.
    //However, UseEffect fires everytime the object's REFERENCE in the computer's memory changes, even if its values have not changed.
    //This causes multiple re-renders. In this case, that means multiple API calls, and consequent calls to the DB - costing money.
    //UseDeepCompareEffect fires only if the VALUES within the object has changed.
    //This is installed using npm i use-deep-compare-effect .
    //REFERENCE available at: https://coder.earth/post/react-hooks-oops-part-2-effect-runs-multiple-times-with-the-same-dependencies/

    async function collectVehiclesAndUpdateOnUI() {
      const data = {
        accountId: loggedInAccountId,
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
        `${process.env.REACT_APP_API_SERVER_BASE_URL}/app/getAllVehiclesDetails`,
        //`http://192.168.0.150:3001/app/getAllVehiclesDetails`,
        options,
      ).catch((err) => console.log(err))
      const serverResponseData = await serverResponse.json()
      console.log(serverResponseData)

      setAllVehiclesListObject(serverResponseData)
      setIsLoading(false)
    }
    collectVehiclesAndUpdateOnUI()
  }, [allVehiclesListObject])

  return (
    <div className="dashboard_TrackOneContentComponentWrapper">
      <div className="sectionHeading">
        <h2>Track One</h2>
        <input
          className="vehicleSearchInput"
          value={searchQueryInput}
          type="text"
          name=""
          id=""
          placeholder="Search Vehicle"
          onChange={(e) => {
            setSearchQueryInput(e.target.value)
          }}
        />
      </div>
      <div className="vehicleCardsHolder">
        {isLoading ? (
          <div className="vehicleCardsLoaderHolder">
            <CircularLoader />
          </div>
        ) : null}

        {!isLoading ? (
          <div
            className="vehicleCard"
            onClick={() => {
              setDashboardCurrentScreen('addNewVehicle')
            }}
          >
            <div
              className="vehicleCardDpHolder"
              style={{
                backgroundImage: `url(${AddLogo})`,
              }}
            ></div>
            <p className="cardTitle">Manage</p>
            <p className="cardDescription">
              Add, remove or transfer vehicles...
            </p>
          </div>
        ) : null}

        {allVehiclesListObject.map((obj, index) => {
          return (
            <div
              className="vehicleCard"
              key={index}
              style={obj.displayStyleObject}
              onClick={() => {
                setCurrentVehicleId(obj.vehicleId)
                setDashboardCurrentScreen('selectedVehicleOptions')
                //setHomeScreenCurrentScreen('trackOne')
              }}
            >
              <div
                className="vehicleCardDpHolder"
                style={{
                  backgroundImage: `url(${obj.displayPictureBase64})`,
                }}
              ></div>
              <p className="cardTitle">{obj.licensePlate}</p>
              <p className="cardDescription">
                {textReduce(obj.vehicleDescription, 15)}
              </p>
              <p className="cardDescription">
                {textReduce(obj.driverName, 15)}
              </p>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default Dashboard_TrackOneContentComponent
