import React, { useState, useContext, useEffect } from 'react'
import { UserContext } from '../userContext'
import './Dashboard_AddNewVehicleComponent.css'

function Dashboard_AddNewVehicleComponent() {
  //Setting the context values...
  const { loggedInAccountId, setDashboardCurrentScreen } = useContext(
    UserContext,
  )

  //Submit Button style states
  const [submitBtnDisabled, setSubmitBtnDisabled] = useState(false)

  //Setting Input Values
  const [vehicleIdInput, setVehicleIdInput] = useState('')
  const [vehiclePasswordInput, setVehiclePasswordInput] = useState('')
  const [
    vehiclePasswordInputDisplay,
    setVehiclePasswordInputDisplay,
  ] = useState('')
  const [licensePlateInput, setLicensePlateInput] = useState('')
  const [vehicleDescriptionInput, setVehicleDescriptionInput] = useState('')
  const [vehicleTypeInput, setVehicleTypeInput] = useState('')
  const [vehicleGroupInput, setVehicleGroupInput] = useState('')
  const [engineNumberInput, setEngineNumberInput] = useState('')
  const [chassisNumberInput, setChassisNumberInput] = useState('')

  //VehicleID input formatter function
  function autoFormatVehicleId(pressedKey, givenId) {
    if (
      pressedKey != 'Backspace' &&
      (givenId.length == 3 || givenId.length == 7 || givenId.length == 11)
    ) {
      setVehicleIdInput(givenId + '-')
    }
  }

  async function getNewVehicleId() {
    //Function to call the API Endpoint that sends a new vehicle ID for linking on the registered email address of the account
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
      `${process.env.REACT_APP_API_SERVER_BASE_URL}/app/getNewVehicleId`,
      //`http://192.168.0.150:3001/app/getNewVehicleId`,
      // `http://nvmservices.ddns.net:3001/app/getNewVehicleId`,
      options,
    ).catch((err) => console.log(err))
    const serverResponseData = await serverResponse.json()
    console.log(serverResponseData)
  }

  const newVehicleFormHandler = async (e) => {
    e.preventDefault()
    //ADD CODE FOR INPUT VALIDATION

    const callAddNewVehicleAPI = async () => {
      const data = {
        accountId: parseInt(loggedInAccountId),
        vehicleId: vehicleIdInput,
        vehiclePassword: vehiclePasswordInput,
        licensePlate: licensePlateInput,
        vehicleDescription: vehicleDescriptionInput,
        vehicleType: vehicleTypeInput,
        vehicleGroup: vehicleGroupInput,
        engineNumber: engineNumberInput,
        chassisNumber: chassisNumberInput,
      }
      console.log(data)

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
        `${process.env.REACT_APP_API_SERVER_BASE_URL}/app/linkTrackerWithAccount`,
        //`http://192.168.0.150:3001/app/linkTrackerWithAccount`,
        options,
      ).catch((err) => console.log(err))

      //   setDashboardCurrentScreen(`trackOne`)
    }
    callAddNewVehicleAPI()
  }

  return (
    <div className="dashboard_AddNewVehicleComponent">
      <div className="sectionHeading">
        <h2>Add a New Vehicle</h2>
      </div>
      <div className="overviewHolder">
        <div className="itemCard">
          <p>Remaining Links</p>
          <h2>3</h2>
        </div>

        <div
          className="itemCard"
          style={{ cursor: 'pointer' }}
          onClick={getNewVehicleId}
        >
          <p>Get a new</p>
          <h2>Vehicle ID</h2>
          <p>on your email</p>
        </div>
      </div>
      <h2 className="sectionSubHeading">Vehicle Details</h2>
      <form
        className="formHolder"
        onSubmit={newVehicleFormHandler}
        autoComplete={'off'}
      >
        <input
          type="text"
          name=""
          id=""
          placeholder="Vehicle ID*"
          value={vehicleIdInput}
          onChange={(e) => {
            setVehicleIdInput(e.target.value.toUpperCase())
          }}
          onKeyUp={(e) => {
            console.log(e)
            autoFormatVehicleId(e.key, e.target.value)
          }}
        />
        <input
          type="text"
          name=""
          id=""
          placeholder="Vehicle Password*"
          value={vehiclePasswordInput}
          onChange={(e) => {
            setVehiclePasswordInput(e.target.value)
          }}
        />
        <input
          type="text"
          name=""
          id=""
          placeholder="License Plate*"
          value={licensePlateInput}
          onChange={(e) => {
            setLicensePlateInput(e.target.value)
          }}
        />
        <input
          type="text"
          name=""
          id=""
          placeholder="Vehicle Description*"
          value={vehicleDescriptionInput}
          onChange={(e) => {
            setVehicleDescriptionInput(e.target.value)
          }}
        />
        <input
          type="text"
          name=""
          id=""
          placeholder="Vehicle Type*"
          value={vehicleTypeInput}
          onChange={(e) => {
            setVehicleTypeInput(e.target.value)
          }}
        />
        <input
          type="text"
          name=""
          id=""
          placeholder="Vehicle Group"
          value={vehicleGroupInput}
          onChange={(e) => {
            setVehicleGroupInput(e.target.value)
          }}
        />
        <input
          type="text"
          name=""
          id=""
          placeholder="Engine Number"
          value={engineNumberInput}
          onChange={(e) => {
            setEngineNumberInput(e.target.value)
          }}
        />
        <input
          type="text"
          name=""
          id=""
          placeholder="Chassis Number"
          value={chassisNumberInput}
          onChange={(e) => {
            setChassisNumberInput(e.target.value)
          }}
        />

        <button
          type="submit"
          className="submitBtn"
          disabled={submitBtnDisabled}
        >
          CREATE
        </button>
      </form>
    </div>
  )
}

export default Dashboard_AddNewVehicleComponent
