import React from 'react'
import './Dashboard_AssignDriverToVehicleID.css'
import Webcam from 'react-webcam'
import { useState, useRef, useContext } from 'react'
import { UserContext } from '../userContext'
import ProcessStageDisplay from './ProcessStageDisplay'
import { CountdownCircleTimer } from 'react-countdown-circle-timer'

function Dashboard_AssignDriverToVehicleID() {
  //Setting the context values...
  const {
    loggedInAccountId,
    setLoggedInAccountId,
    currentVehicleId,
    dashboardCurrentScreen,
    setDashboardCurrentScreen,
    dataFromDate,
    dataToDate,
    hasTravelledOnDate,
    setHasTravelledOnDate,
  } = useContext(UserContext)

  const webcamRef = useRef(null)
  const [driverPhotoBase64, setDriverPhotoBase64] = useState(false)
  const [driverFullName, setDriverFullName] = useState('')
  const [driverEmail, setDriverEmail] = useState('')
  const [driverContact, setDriverContact] = useState('')
  const [requestId, setRequestId] = useState(false) //For OTP verification
  const [otp, setOtp] = useState(false) //OTP is sent as a string
  const [otpValidationMessage, setOtpValidationMessage] = useState('')

  const driverDataToUpload = {
    vehicleId: currentVehicleId,
    driverPhotoBase64: driverPhotoBase64,
    driverFullName: driverFullName,
    driverEmail: driverEmail,
    driverContact: driverContact,
    requestId: requestId,
    otp: otp,
  }

  //Function to call API to generate and send new OTP to phone number
  async function getOTP() {
    const data = {
      phoneNumber: driverContact,
      transactionName: 'new driver assignment', //This is displayed as is in the OTP SMS sent to the phone
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
      `${process.env.REACT_APP_API_SERVER_BASE_URL}/app/getOTP`,
      // `http://192.168.0.150:3001/app/getOTP`,
      // `http://nvmservices.ddns.net:3001/app/getOTP`,
      options,
    ).catch((err) => console.log(err))
    const serverResponseData = await serverResponse.json()
    //console.log(serverResponseData)
    setRequestId(serverResponseData.requestId)
  }

  //Function to call API to upload and update new driver details
  async function assignNewDriver() {
    const data = driverDataToUpload
    console.log(driverDataToUpload)
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
      `${process.env.REACT_APP_API_SERVER_BASE_URL}/app/assignDriverToVehicleID`,
      // `http://192.168.0.150:3001/app/assignDriverToVehicleID`,
      // `http://nvmservices.ddns.net:3001/app/assignDriverToVehicleID`,
      options,
    ).catch((err) => console.log(err))
    const serverResponseData = await serverResponse.json()
    console.log(serverResponseData)
    if (serverResponseData.otpValidationSuccess === true) {
      setDashboardCurrentScreen('selectedVehicleOptions')
    } else {
      setOtpValidationMessage(serverResponseData.message)
    }
  }

  //Process Stages Array - For Process Stage Display
  const processStagesArray = [
    {
      stage: 1,
      title: `Driver's Photo`,
    },
    {
      stage: 2,
      title: `Driver's Details`,
    },
    {
      stage: 3,
      title: `Contact Verification`,
    },
  ]

  //For displaying process step number
  const [currentProcessStage, setCurrentProcessStage] = useState(1)

  //videoConstraints for <Webcam />
  const videoConstraints = {
    width: 1280,
    height: 720,
    facingMode: 'user',
  }

  const captureImage = () => {
    setDriverPhotoBase64(webcamRef.current.getScreenshot())
  }

  return (
    <div className="dashboard_AssignDriverToVehicleIDWrapper">
      <div className="sectionHeading">
        <h2>NUMPLATE ‣ New Driver</h2>
      </div>
      <ProcessStageDisplay
        processStagesArray={processStagesArray}
        currentProcessStage={currentProcessStage}
        setCurrentProcessStage={setCurrentProcessStage}
      />
      {/* Element to display for stage 1 */}
      {currentProcessStage == 1 ? (
        <div className="cameraFunctionsHolder">
          <div className="cameraContainer">
            {!driverPhotoBase64 ? (
              <>
                <Webcam
                  mirrored
                  audio={false}
                  ref={webcamRef}
                  screenshotFormat={'image/jpeg'}
                  screenshotQuality={0.5}
                  height={300}
                  videoConstraints={videoConstraints}
                />
              </>
            ) : (
              <div
                className="newDriverPhotoHolder"
                style={{
                  backgroundImage: `url(${driverPhotoBase64})`,
                }}
              ></div>
            )}
          </div>
          <div className="cameraBtnsHolder">
            {!driverPhotoBase64 ? (
              <>
                <div className="btn primaryCTA" onClick={captureImage}>
                  <p>Capture</p>
                </div>

                <div className="btn secondaryCTA">
                  <p>Use Smart Phone</p>
                </div>
              </>
            ) : (
              <>
                <div
                  className="btn secondaryCTA"
                  onClick={() => {
                    setDriverPhotoBase64(false)
                  }}
                >
                  <p>Retake</p>
                </div>

                <div
                  className="btn primaryCTA"
                  onClick={() => {
                    setCurrentProcessStage(2)
                  }}
                >
                  <p>Done</p>
                </div>
              </>
            )}
          </div>
        </div>
      ) : null}

      {/* Element to display for stage 2 */}
      {currentProcessStage == 2 ? (
        <>
          <div className="newDriverDetailsForm">
            <div
              className="newDriverPhotoDisplay"
              style={{
                backgroundImage: `url(${driverPhotoBase64})`,
              }}
            ></div>
            <div className="inputHolder">
              <input
                className="driverDetailsInput"
                type="text"
                placeholder="Full Name"
                value={driverFullName}
                onChange={(e) => {
                  setDriverFullName(e.target.value)
                }}
              />
              <input
                className="driverDetailsInput"
                type="text"
                placeholder="Email ID"
                value={driverEmail}
                onChange={(e) => {
                  setDriverEmail(e.target.value)
                }}
              />
              <input
                className="driverDetailsInput"
                type="text"
                placeholder="Contact"
                value={driverContact}
                onChange={(e) => {
                  setDriverContact(e.target.value)
                }}
              />
            </div>
          </div>
          {/* Display CTAs Holder */}
          <div className="CTAsHolder">
            <div
              className="btn secondaryCTA"
              onClick={() => {
                // console.log(driverDataToUpload)
                assignNewDriver()
              }}
            >
              <p>Save &amp; Skip Verification</p>
            </div>

            <div
              className="btn primaryCTA"
              onClick={() => {
                getOTP()
                setCurrentProcessStage(3)
              }}
            >
              <p>Send OTP</p>
            </div>
          </div>
        </>
      ) : null}

      {/* Element to display for stage 3 */}
      {currentProcessStage == 3 ? (
        <>
          <div className="otpFormHolder">
            <div className="otpInputHolder">
              <input
                value={otp}
                className="otpInput"
                type="number"
                name=""
                id=""
                onChange={(e) => {
                  setOtp(e.target.value)
                }}
              />
              <p className="otpValidationMessage">{otpValidationMessage}</p>
            </div>

            <div className="btn primaryCTA" onClick={assignNewDriver}>
              <p>SUBMIT</p>
            </div>
          </div>
        </>
      ) : null}
    </div>
  )
}

export default Dashboard_AssignDriverToVehicleID
